#include "mainwindow.h"
#include "ui_mainwindow.h"
#include<QDebug>
MainWindow::MainWindow(QWidget *parent)
    : QMainWindow(parent)
    , ui(new Ui::MainWindow)
{
    ui->setupUi(this);
}

MainWindow::~MainWindow()
{
    delete ui;
}

void MainWindow::on_btnSetPath_clicked()
{
    qInfo( "set path" );
}

void MainWindow::on_btnSetServer_clicked()
{
    qInfo( "set server" );
}

void MainWindow::on_btnFetchPaper_clicked()
{
    qInfo( "fetch paper" );
}

void MainWindow::on_actionReload_triggered()
{
    qInfo( "reload" );
}

void MainWindow::on_actionAbout_triggered()
{
    qInfo( "about" );
}

