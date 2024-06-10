#include "appcontroller.h"

AppController::AppController(QObject *parent)
    : QObject{parent}
{
    _listener.initConnections();
}

AppController::~AppController()
{

}

void AppController::startListener(int port)
{
    _listener.setPort(port);
    _listener.startListener();
}

void AppController::stopListener()
{
    _listener.stopListener();
}
