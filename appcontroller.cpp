#include "appcontroller.h"

QString AppController::localIpAddress() const
{
    return _localIpAddress;
}

AppController::AppController(QObject *parent)
    : QObject{parent}
{
    // TODO: This is too much work for a constructor.
    _listener.initConnections();
    _listener.setParseCallback([&] (QByteArray msg) {
        qDebug() << "Parse callback: " << msg;
        QString timestamp = _createTimestamp();
        emit postInfo(timestamp, msg);
    });
    fetchLocalIpAddress();
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

void AppController::fetchLocalIpAddress()
{
    QList<QHostAddress> hostAddressList = QNetworkInterface::allAddresses();
    for (const QHostAddress &address : hostAddressList) {
        bool isGoodAddress = address.protocol() == QAbstractSocket::IPv4Protocol
                            && !address.isLoopback();
        if (!isGoodAddress) { continue; }
        _localIpAddress = address.toString();
        emit localIpAddressChanged();
        break;
    }
}

QString AppController::_createTimestamp()
{
    // TODO: Generate an actual timestamp.
    return "00:00:00";
}
