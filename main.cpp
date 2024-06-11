#include <QDebug>
#include <QGuiApplication>
#include <QQmlApplicationEngine>
#include <QQmlContext>
#include <QIcon>

#include "appcontroller.h"

int main(int argc, char *argv[])
{
    QGuiApplication app(argc, argv);

    // App settings

    app.setApplicationName("Mobile Socket Listener App");
    app.setApplicationDisplayName("Mobile Socket Listener App");
    app.setApplicationVersion("1.0.0");
    app.setOrganizationName("erickveil.net");
    app.setDesktopFileName("Mobile Socket Listener App");
    app.setObjectName("Mobile Socket Listener App");
    //QIcon icon(":/media/Archway1024.jpg");
    //app.setWindowIcon(icon);
    app.setOrganizationDomain("erickveil.net");

    // --------------------
    // Context Properties
    AppController controller;

    QQmlApplicationEngine engine;
    QQmlContext *context = engine.rootContext();

    context->setContextProperty("controller", &controller);

    const QUrl url(u"qrc:/main.qml"_qs);
    QObject::connect(&engine, &QQmlApplicationEngine::objectCreated,
                     &app, [url](QObject *obj, const QUrl &objUrl) {
        if (!obj && url == objUrl)
            QCoreApplication::exit(-1);
    }, Qt::QueuedConnection);
    engine.load(url);

    return app.exec();
}
