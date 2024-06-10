#ifndef APPCONTROLLER_H
#define APPCONTROLLER_H

#include <QObject>

#include "universallistener.h"

using namespace evtools;

class AppController : public QObject
{
    Q_OBJECT

    UniversalListener _listener;

public:
    explicit AppController(QObject *parent = nullptr);
    ~AppController();

public slots:
    void startListener(int port);
    void stopListener();

signals:

};

#endif // APPCONTROLLER_H
