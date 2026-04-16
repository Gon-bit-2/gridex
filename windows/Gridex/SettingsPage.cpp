#include "pch.h"
#include "xaml-includes.h"
#include <winrt/Microsoft.UI.Xaml.Interop.h>
#include <shellapi.h>
#include "SettingsPage.h"
#include "Models/AppSettings.h"
#include "GridexVersion.h"
#if __has_include("SettingsPage.g.cpp")
#include "SettingsPage.g.cpp"
#endif

namespace winrt::Gridex::implementation
{
    namespace mux  = winrt::Microsoft::UI::Xaml;
    namespace muxc = winrt::Microsoft::UI::Xaml::Controls;

    SettingsPage::SettingsPage()
    {
        InitializeComponent();

        this->Loaded([this](winrt::Windows::Foundation::IInspectable const&, mux::RoutedEventArgs const&)
        {
            // Stamp the build version into the About section. GRIDEX_VERSION
            // comes from GridexVersion.h which pulls the CI-generated header
            // when present (release builds) or falls back to "0.0.0-dev".
            VersionText().Text(winrt::hstring(L"Version " GRIDEX_VERSION));

            // Load persisted settings into UI
            auto s = DBModels::AppSettings::Load();
            ThemeCombo().SelectedIndex(s.themeIndex);
            AiProviderCombo().SelectedIndex(s.aiProviderIndex);
            ApiKeyBox().Password(winrt::hstring(s.aiApiKey));
            ModelBox().Text(winrt::hstring(s.aiModel));
            OllamaEndpointBox().Text(winrt::hstring(s.ollamaEndpoint));
            EditorFontSizeBox().Value(static_cast<double>(s.editorFontSize));
            RowLimitBox().Value(static_cast<double>(s.rowLimit));

            ThemeCombo().SelectionChanged(
                [this](winrt::Windows::Foundation::IInspectable const&, muxc::SelectionChangedEventArgs const&)
                {
                    // Inline: SelectionChangedEventArgs cannot be default-constructed
                    int index = ThemeCombo().SelectedIndex();
                    auto root = this->XamlRoot();
                    if (!root) return;
                    auto fe = root.Content().try_as<mux::FrameworkElement>();
                    if (!fe) return;
                    switch (index)
                    {
                    case 0: fe.RequestedTheme(mux::ElementTheme::Default); break;
                    case 1: fe.RequestedTheme(mux::ElementTheme::Light); break;
                    case 2: fe.RequestedTheme(mux::ElementTheme::Dark); break;
                    }
                });
            SaveAiButton().Click(
                [this](winrt::Windows::Foundation::IInspectable const&, mux::RoutedEventArgs const&)
                {
                    SaveAiSettings_Click({}, {});
                });

            // View Open Source Licenses — open THIRD-PARTY-NOTICES.txt
            // bundled in Assets/ via the system default text editor.
            ViewLicensesButton().Click(
                [](winrt::Windows::Foundation::IInspectable const&, mux::RoutedEventArgs const&)
                {
                    wchar_t exePath[MAX_PATH] = {};
                    GetModuleFileNameW(nullptr, exePath, MAX_PATH);
                    std::wstring exeDir(exePath);
                    auto slash = exeDir.find_last_of(L"\\/");
                    if (slash != std::wstring::npos) exeDir = exeDir.substr(0, slash);
                    std::wstring noticesPath = exeDir + L"\\Assets\\THIRD-PARTY-NOTICES.txt";
                    ShellExecuteW(nullptr, L"open", noticesPath.c_str(),
                                  nullptr, nullptr, SW_SHOWNORMAL);
                });

            // Back button — navigate back to the page user came from
            BackBtn().Click(
                [this](winrt::Windows::Foundation::IInspectable const&, mux::RoutedEventArgs const&)
                {
                    muxc::Frame frame{ nullptr };
                    auto fe = this->try_as<mux::FrameworkElement>();
                    while (fe)
                    {
                        if (auto f = fe.try_as<muxc::Frame>()) { frame = f; break; }
                        fe = fe.Parent().try_as<mux::FrameworkElement>();
                    }
                    if (!frame) frame = this->Frame();
                    if (!frame) return;

                    // Read stored previous page (defaults to HomePage)
                    auto saved = DBModels::AppSettings::Load();
                    std::wstring targetPage = saved.lastPageBeforeSettings;
                    if (targetPage.empty()) targetPage = L"Gridex.HomePage";

                    winrt::Windows::UI::Xaml::Interop::TypeName pageType;
                    pageType.Name = winrt::hstring(targetPage);
                    pageType.Kind = winrt::Windows::UI::Xaml::Interop::TypeKind::Metadata;
                    frame.Navigate(pageType);
                });
        });
    }

    void SettingsPage::SaveAiSettings_Click(
        winrt::Windows::Foundation::IInspectable const&,
        mux::RoutedEventArgs const&)
    {
        // Load current (preserve fields not touched here), then overwrite from UI
        auto s = DBModels::AppSettings::Load();
        s.themeIndex         = ThemeCombo().SelectedIndex();
        s.aiProviderIndex    = AiProviderCombo().SelectedIndex();
        s.aiApiKey           = std::wstring(ApiKeyBox().Password());
        s.aiModel            = std::wstring(ModelBox().Text());
        s.ollamaEndpoint     = std::wstring(OllamaEndpointBox().Text());
        s.editorFontSize     = static_cast<int>(EditorFontSizeBox().Value());
        s.rowLimit           = static_cast<int>(RowLimitBox().Value());

        bool ok = s.Save();

        muxc::ContentDialog dialog;
        dialog.Title(winrt::box_value(winrt::hstring(
            ok ? L"Settings Saved" : L"Save Failed")));
        dialog.Content(winrt::box_value(winrt::hstring(
            ok ? L"Settings have been saved."
               : L"Could not write to settings file.")));
        dialog.CloseButtonText(L"OK");
        dialog.XamlRoot(this->XamlRoot());
        dialog.ShowAsync();
    }
}
