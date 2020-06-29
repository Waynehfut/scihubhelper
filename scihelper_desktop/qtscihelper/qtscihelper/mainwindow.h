#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QMainWindow>

QT_BEGIN_NAMESPACE
namespace Ui { class MainWindow; }
QT_END_NAMESPACE

class MainWindow : public QMainWindow
{
    Q_OBJECT

public:
    MainWindow(QWidget *parent = nullptr);
    ~MainWindow();

private slots:
    void on_btnFetchPaper_clicked();

    void on_btnSetServer_clicked();

    void on_btnSetPath_clicked();

    void on_actionAbout_triggered();

    void on_actionReload_triggered();

private:
    Ui::MainWindow *ui;
};
#endif // MAINWINDOW_H
