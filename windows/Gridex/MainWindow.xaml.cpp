#include "pch.h"
#include "xaml-includes.h"
#include <winrt/Microsoft.UI.Windowing.h>
#include <winrt/Microsoft.UI.Xaml.Interop.h>
#include <winrt/Microsoft.UI.Interop.h>
#include <winrt/Windows.System.h>
#include "MainWindow.xaml.h"
#if __has_include("MainWindow.g.cpp")
#include "MainWindow.g.cpp"
#endif

#include "HomePage.h"
#include "WorkspacePage.h"
#include "Models/AppSettings.h"

namespace winrt::Gridex::implementation
{
    namespace mux = winrt::Microsoft::UI::Xaml;

    MainWindow::MainWindow()
    {
        this->Activated([this](auto const&, auto const&)
        {
            static bool initialized = false;
            if (initialized) return;
            initialized = true;

            auto appWindow = this->AppWindow();
            appWindow.Resize(winrt::Windows::Graphics::SizeInt32{ 1280, 800 });

            // Title-bar icon. Gridex.rc embeds the phoenix .ico as
            // resource ID 1 inside Gridex.exe; WinUI 3 does not pick
            // that up for the AppWindow title bar automatically, so we
            // load the HICON from our own module and hand it back to
            // WinUI via the Win32 interop IconId bridge.
            if (HICON hIcon = ::LoadIconW(::GetModuleHandleW(nullptr),
                                          MAKEINTRESOURCEW(1)))
            {
                try
                {
                    auto iconId = winrt::Microsoft::UI::GetIconIdFromIcon(hIcon);
                    appWindow.SetIcon(iconId);
                }
                catch (...) { /* best effort -- ignore failure */ }
            }

            if (auto content = this->Content().try_as<mux::FrameworkElement>())
            {
                content.RequestedTheme(mux::ElementTheme::Dark);

                // Wire keyboard shortcuts in code-behind (no XAML accelerators = no tooltip leak)
                auto settingsAccel = mux::Input::KeyboardAccelerator();
                settingsAccel.Key(winrt::Windows::System::VirtualKey::P);
                settingsAccel.Modifiers(static_cast<winrt::Windows::System::VirtualKeyModifiers>(
                    static_cast<uint32_t>(winrt::Windows::System::VirtualKeyModifiers::Control) |
                    static_cast<uint32_t>(winrt::Windows::System::VirtualKeyModifiers::Shift)));
                settingsAccel.Invoked([this](auto&&, mux::Input::KeyboardAcceleratorInvokedEventArgs const& args)
                {
                    // Remember current page for Back button
                    auto s = DBModels::AppSettings::Load();
                    auto currentContent = ContentFrame().Content();
                    if (currentContent.try_as<winrt::Gridex::WorkspacePage>())
                        s.lastPageBeforeSettings = L"Gridex.WorkspacePage";
                    else if (currentContent.try_as<winrt::Gridex::HomePage>())
                        s.lastPageBeforeSettings = L"Gridex.HomePage";
                    s.Save();

                    NavigateTo(L"Gridex.SettingsPage");
                    args.Handled(true);
                });
                content.KeyboardAccelerators().Append(settingsAccel);

                auto homeAccel = mux::Input::KeyboardAccelerator();
                homeAccel.Key(winrt::Windows::System::VirtualKey::H);
                homeAccel.Modifiers(winrt::Windows::System::VirtualKeyModifiers::Control);
                homeAccel.Invoked([this](auto&&, mux::Input::KeyboardAcceleratorInvokedEventArgs const& args)
                {
                    NavigateTo(L"Gridex.HomePage");
                    args.Handled(true);
                });
                content.KeyboardAccelerators().Append(homeAccel);
            }

            NavigateTo(L"Gridex.HomePage");
        });
    }

    void MainWindow::NavigateTo(const wchar_t* pageTypeName)
    {
        winrt::Windows::UI::Xaml::Interop::TypeName pageType;
        pageType.Name = pageTypeName;
        pageType.Kind = winrt::Windows::UI::Xaml::Interop::TypeKind::Metadata;
        ContentFrame().Navigate(pageType);
    }

    void MainWindow::SettingsAccelerator_Invoked(
        mux::Input::KeyboardAccelerator const&,
        mux::Input::KeyboardAcceleratorInvokedEventArgs const& args)
    {
        NavigateTo(L"Gridex.SettingsPage");
        args.Handled(true);
    }

    void MainWindow::NewQueryAccelerator_Invoked(
        mux::Input::KeyboardAccelerator const&,
        mux::Input::KeyboardAcceleratorInvokedEventArgs const& args)
    {
        args.Handled(true);
    }

    void MainWindow::CloseTabAccelerator_Invoked(
        mux::Input::KeyboardAccelerator const&,
        mux::Input::KeyboardAcceleratorInvokedEventArgs const& args)
    {
        args.Handled(true);
    }

    void MainWindow::HomeAccelerator_Invoked(
        mux::Input::KeyboardAccelerator const&,
        mux::Input::KeyboardAcceleratorInvokedEventArgs const& args)
    {
        NavigateTo(L"Gridex.HomePage");
        args.Handled(true);
    }
}
