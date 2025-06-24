using Avalonia.Controls;
using SparklePlayer.ViewModels;

namespace SparklePlayer.Views;

public partial class MainWindow : Window
{
    public MainWindow()
    {
        InitializeComponent();
        DataContext = new MainWindowViewModel(this);
    }
}