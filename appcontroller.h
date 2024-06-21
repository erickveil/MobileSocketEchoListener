#ifndef APPCONTROLLER_H
#define APPCONTROLLER_H

#include <QAbstractSocket>
#include <QHostAddress>
#include <QList>
#include <QNetworkInterface>
#include <QObject>

#include "universallistener.h"

using namespace evtools;

class AppController : public QObject
{
    Q_OBJECT
    Q_PROPERTY(QString localIpAddress READ localIpAddress NOTIFY localIpAddressChanged)

    UniversalListener _listener;
    QString _localIpAddress;

public:

    explicit AppController(QObject *parent = nullptr);
    ~AppController();

    QString localIpAddress() const;

public slots:
    void startListener(int port);
    void stopListener();

signals:
    void localIpAddressChanged();
    void postInfo(const QString &timestamp, const QString &message);

private:
    void fetchLocalIpAddress();
    QString _createTimestamp();

};

#endif // APPCONTROLLER_H
