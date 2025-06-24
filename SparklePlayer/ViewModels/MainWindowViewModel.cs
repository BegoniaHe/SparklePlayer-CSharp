using System;
using Avalonia;
using Avalonia.Controls;
using Avalonia.Styling;
using CommunityToolkit.Mvvm.Input;

namespace SparklePlayer.ViewModels;

public partial class MainWindowViewModel : ViewModelBase
{
    public MainWindowViewModel()
    {
        // 默认构造函数
    }
    /// <summary>
    /// 窗口最小大小: 720p 分辨率
    /// </summary>
    public double MainWindowWidthMin { get; } = 640;
    public double MainWindowHeightMin { get; } = 360;

    /// <summary>
    /// 窗口默认大小: 根据屏幕分辨率动态计算
    /// 当屏幕分辨率小于 800x600 时，使用最小大小
    /// 当屏幕分辨率大于 800x600 时，使用屏幕分辨率的 80%
    /// </summary>
    private readonly double _screenWidth;
    private readonly double _screenHeight;
   
   

    public MainWindowViewModel(Window? mainWindow)
    {
        if (mainWindow is null)
            throw new ArgumentNullException(nameof(mainWindow));
        var srp = new AvaloniaScreenResolutionProvider(mainWindow);
        (_screenWidth, _screenHeight) = srp.GetPrimaryResolution();
    }

    public double MainWindowWidthDefault => Math.Max(MainWindowWidthMin, _screenWidth * 0.8);
    public double MainWindowHeightDefault => Math.Max(MainWindowHeightMin, _screenHeight * 0.8);
    public string Greeting { get; } = "Welcome to Sparkle Player!"; // 欢迎语
    public string Version { get; } = "1.0.0"; // 这里可以动态获取版本号

    /// <summary>
    /// 切换主题
    /// </summary>
    [RelayCommand]
    private void ChangeTheme()
    {
        if(Application.Current is null)
            return;
        
        Application.Current.RequestedThemeVariant = Application.Current.RequestedThemeVariant == ThemeVariant.Light
            ? ThemeVariant.Dark
            : ThemeVariant.Light;
    }
}