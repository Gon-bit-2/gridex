#pragma once
#include <string>
#include <memory>
#include "DatabaseAdapter.h"
#include "DumpRestoreService.h"  // ProgressCallback

namespace DBModels
{
    struct ERDiagramResult
    {
        bool success = false;
        std::wstring d2Text;         // Generated D2 source
        std::wstring svgPath;        // Path to rendered SVG file in temp dir
        int tableCount = 0;
        int relationshipCount = 0;
        std::wstring error;          // Subprocess stderr or generation error
    };

    // Generate ER diagram from schema using D2 declarative format.
    // Renders via bundled d2.exe (Assets/d2/d2.exe) -> SVG file in temp dir.
    // Native rendering via WinUI 3 SvgImageSource on caller side.
    class ERDiagramService
    {
    public:
        // Full pipeline: introspect schema -> generate D2 -> run d2.exe -> SVG path
        static ERDiagramResult Generate(
            std::shared_ptr<DatabaseAdapter> adapter,
            const std::wstring& schema,
            ProgressCallback progress = nullptr);

        // Just the D2 text without rendering — used by Copy D2 button
        static std::wstring GenerateD2Text(
            std::shared_ptr<DatabaseAdapter> adapter,
            const std::wstring& schema,
            ProgressCallback progress = nullptr);

        // Resolve d2.exe path (Package.Current install dir or exe dir)
        static std::wstring LocateD2Exe();
    };
}
