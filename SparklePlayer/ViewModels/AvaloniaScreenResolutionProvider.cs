using System;
using Avalonia.Controls;

namespace SparklePlayer.ViewModels;

// <summary>
// 提供屏幕分辨率信息的接口
// </summary>
public interface IScreenResolutionProvider
{
    (double Width, double Height) GetPrimaryResolution();
}

public class AvaloniaScreenResolutionProvider : IScreenResolutionProvider
{
    private readonly Window _window;

    public AvaloniaScreenResolutionProvider(Window window)
    {
        _window = window ?? throw new ArgumentNullException(nameof(window));
    }

    /// <summary>
    /// 获取主屏幕的分辨率
    /// <returns> 主屏幕的宽度和高度</returns>
    /// </summary>
    public (double Width, double Height) GetPrimaryResolution()
    {
        var bounds = _window.Screens?.Primary?.Bounds 
                     ?? throw new InvalidOperationException("主屏幕信息为空");
        return (bounds.Width, bounds.Height);
    }
}
