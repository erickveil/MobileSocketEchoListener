
// Copyright 2018 Erick Veil

#include "universallistener.h"

namespace evtools {

UniversalListener::UniversalListener(QObject *parent) : QObject(parent)
{
    Name = "Null Listner";
}

UniversalListener::UniversalListener(int port)
{
    setPort(port);
    Name = "Listener:" + QString::number(port);
}

UniversalListener::UniversalListener(
        int port, std::function<void (QByteArray)> parseCallback)
{
    initData(port,parseCallback);
    Name = "Listener:" + QString::number(port);
}

UniversalListener::UniversalListener(
        int port, std::function<void (QByteArray)> parseCallback,
        std::function<QByteArray (QByteArray)> ackCallback)
{
    initData(port,parseCallback, ackCallback);
    Name = "Listener:" + QString::number(port);
}

UniversalListener::UniversalListener(int port,
        std::function<void (QByteArray)> parseCallback,
        std::function<QByteArray (QByteArray)> ackCallback,
        std::function<void (QAbstractSocket::SocketError, QString)>
                                     errorCallback)
{
    initData(port,parseCallback, ackCallback, errorCallback);
    Name = "Listener:" + QString::number(port);
}

void UniversalListener::initData(
        int port, std::function<void (QByteArray)> parseCallback)
{
    setPort(port);
    setParseCallback(parseCallback);
    initConnections();
}

void UniversalListener::initData(
        int port,
        std::function<void (QByteArray)> parseCallback,
        std::function<QByteArray (QByteArray)> ackCallback)
{
    setPort(port);
    setParseCallback(parseCallback);
    setAckCallback(ackCallback);
    initConnections();
}

void UniversalListener::initData(int port,
        std::function<void (QByteArray)> parseCallback,
        std::function<QByteArray (QByteArray)> ackCallback,
        std::function<void (QAbstractSocket::SocketError, QString)>
                                 errorCallback)
{
    setPort(port);
    setParseCallback(parseCallback);
    setAckCallback(ackCallback);
    setErrorCallback(errorCallback);
    initConnections();
}

void UniversalListener::setPort(int port)
{
    qDebug() << "Setting port: " << port;
    _port = port;
}

void UniversalListener::setParseCallback(
        std::function<void (QByteArray)> parseCallback)
{
    _parseCallback = parseCallback;
}

void UniversalListener::setAckCallback(
        std::function<QByteArray (QByteArray)> ackCallback)
{
    _ackCallback = ackCallback;
}

void UniversalListener::setErrorCallback(
        std::function<void (
            QAbstractSocket::SocketError, QString)> errorCallback)
{
    _errorCallback = errorCallback;
}

void UniversalListener::setConnectionCallback(
        std::function<void ()> connectionCallback)
{
    _connectionCallback = connectionCallback;
}

UniversalListener::~UniversalListener()
{
    if (_connection != nullptr) {
        delete _connection;
        _connection = nullptr;
    }
}

void UniversalListener::initConnections()
{
    if (_isSignalsConnected) { return; }
    connect(&_server,
            SIGNAL(acceptError(QAbstractSocket::SocketError)),
            this,
            SLOT(_eventListenerAcceptError(QAbstractSocket::SocketError)));
    connect(&_server,
            SIGNAL(newConnection()),
            this,
            SLOT(_eventListenerNewConnection()));
    _isSignalsConnected = true;
}

void UniversalListener::startListener()
{
    qDebug() << "Start Listener Called.";

    // const char *me = __PRETTY_FUNCTION__;
    QString name = Name == ""
            ? ""
            : Name + " (" + QString::number(_port) + ") ";
    QString logMsg;
    if (!_isSignalsConnected || _port == -1) {
        logMsg = name + "Listener not initialized.";
        //LOG_ERROR(logMsg);
        return;
    }

    if (_server.isListening()) { _server.close(); }

    bool isListening = _server.listen(QHostAddress::Any, _port);

    if (!isListening) {
        logMsg = name + "Problem while listening: " + _server.errorString();
        //StaticLogger::logWarn(me, __LINE__, logMsg);
        if (_errorCallback) {
            _errorCallback(_server.serverError(), _server.errorString());
        }
        _server.close();
        return;
    }
    else {
        logMsg = name + "Listening on " + _server.serverAddress().toString()
                 + ":" + QString::number(_server.serverPort());
        //StaticLogger::logInfo(me, __LINE__, logMsg);
    }
}

void UniversalListener::stopListener()
{
    qDebug() << "Stop Listener Called.";
    if (_server.isListening()) { _server.close(); }
}

int UniversalListener::getPort()
{
    return _port;
}

void UniversalListener::_respondWithAck()
{
    //LOG_INFO("_respondWithAck");
    QByteArray ack;
    ack.clear();

    if (_ackCallback) {
        ack = _ackCallback(_receivedDataBuffer);
    }
    else { ack = _receivedDataBuffer; }
    if (ack.size() == 0) { ack = "ack"; }

    int bytes = _connection->write(ack);
    //LOG_INFO("Queueing " + QString::number(bytes) + " bytes to write for ack.");
    //LOG_INFO("Response message: " + ack);
    bool isFlush = _connection->flush();
    QString msg = isFlush ? "Flush ok" : "No flush";
    //LOG_INFO(msg);
    msg = "There are " + QString::number(_receivedDataBuffer.count()) +
            " bytes in the received buffer.";

    /* If it's a constant connection, the received buffer will continue to
     * accumulate forever, and needs to be cleaned out each time.
     */
    if (IsConstConnection) { _receivedDataBuffer.clear(); }

    //LOG_INFO(msg);
    bool isOpen = _connection->isOpen();
    msg = isOpen ? "Connection is still open." : "Connection is closed.";
    //LOG_INFO(msg);
}

void UniversalListener::_processReceivedBytes()
{
    //LOG_INFO("_processReceivedBytes");
    if (_parseCallback) {
        _parseCallback(_receivedDataBuffer);
    }
}

void UniversalListener::_eventListenerAcceptError(
        QAbstractSocket::SocketError err)
{
    //LOG_INFO("_eventListnerAcceptError");
    //qDebug() << "Connection accept error: " + _server.errorString();
    if (_errorCallback) { _errorCallback(err, _server.errorString()); }
}

void UniversalListener::_eventListenerNewConnection()
{
    //LOG_INFO("_eventListenerNewConnection");
    //qDebug() << "Event new connection.";

    // new connection, prime buffer
    _receivedDataBuffer.clear();

    if (_connection != nullptr) {
        if (_connection->isOpen()) { _connection->close(); }
        delete _connection;
        _connection = nullptr;
    }

    _connection = _server.nextPendingConnection();

    QString logMsg = "Remote client at "
            + _connection->peerAddress().toString()
            + " has connected to "
            + Name
            + " listener port "
            + QString::number(_port);
    //StaticLogger::logInfo(__PRETTY_FUNCTION__, __LINE__, logMsg);

    if (!IsConstConnection) {
        _isWaitingOnData = true;
        QTimer::singleShot(MAX_READ_WAIT_MS, this,
                           SLOT(_eventReadyReadTimeout()));
    }

    connect(_connection, SIGNAL(connected()),
            this, SLOT(_eventSocketConnected()) );
    connect(_connection, SIGNAL(disconnected()),
            this, SLOT(_eventSocketDisconnected()));
    /*
    connect(_connection, QOverload<QAbstractSocket::SocketError>::
            of(&QAbstractSocket::error),
            [=](QAbstractSocket::SocketError socketError) {
        _eventSocketError(socketError);
    });
    */
    connect(_connection, SIGNAL(stateChanged(QAbstractSocket::SocketState)),
            this, SLOT(_eventSocketStateChanged(QAbstractSocket::SocketState)));
    connect(_connection, SIGNAL(aboutToClose()),
            this, SLOT(_eventIODeviceAboutToClose()));
    connect(_connection, SIGNAL(bytesWritten(qint64)),
            this, SLOT(_eventIODeviceBytesWritten(qint64)));
    connect(_connection, SIGNAL(readyRead()),
            this, SLOT(_eventIODeviceReadyRead()));

    if (_connectionCallback) { _connectionCallback(); }
}

void UniversalListener::_eventSocketConnected()
{
    //LOG_INFO("_eventSocketConnected");
    // for the response socket, not the listener

}

void UniversalListener::_eventSocketDisconnected()
{
    //LOG_INFO("_eventSocketDisconnected");
    // for the response socket, not the listener
}

void UniversalListener::_eventSocketError(QAbstractSocket::SocketError err)
{
    //LOG_INFO("_eventSocketError: " + QString::number(err));
    if (err == QAbstractSocket::SocketError::RemoteHostClosedError) {
        //LOG_INFO("The remote host has closed the connection.");
        // LOG_INFO("Final buffer size: " + QString::number(_receivedDataBuffer.count()));
    }
    // for the response socket, not the listener
    if (_errorCallback) { _errorCallback(err, _connection->errorString()); }
}

void UniversalListener::_eventSocketStateChanged(
        QAbstractSocket::SocketState state)
{
    //LOG_INFO("_eventSocetStateChanged: " + QString::number(state));

    if (state == QAbstractSocket::ClosingState) {
        _processReceivedBytes();
    }
}

void UniversalListener::_eventIODeviceAboutToClose()
{
    //LOG_INFO("_eventIODeviceAboutToClose");
    // for the response socket, not the listener
    //qDebug() << "Event About to Close.";

}

void UniversalListener::_eventIODeviceBytesWritten(qint64 bytes)
{
    //LOG_INFO("_eventIODeviceBytesWritten");
    //Q_UNUSED(bytes);
    QString logMsg = "Bytes sent as ack: " + QString::number(bytes);
    // LOG_INFO(logMsg);
    _connection->flush();
}

void UniversalListener::_eventIODeviceReadyRead()
{
    //LOG_INFO("_eventIODeviceReadyRead");
    //LOG_INFO("Event Ready Read.");

    while (_connection->bytesAvailable() > 0) {
        QByteArray dataReceived = _connection->readAll();
        // LOG_INFO("Bytes received this round: " +
        //         QString::number(dataReceived.count()));
        _receivedDataBuffer.append(dataReceived);
    }

    QString logMsg = "Total bytes received: " +
            QString::number(_receivedDataBuffer.size());
    // LOG_INFO(logMsg);
    _respondWithAck();
}

void UniversalListener::_eventReadyReadTimeout()
{
    //LOG_INFO("_eventReadyReadTimeout");
    /// Noticing that legit messages get to this point that have no newline at
    /// the end of them. It's like the socket is read, and we still time out
    /// here.
    //LOG_WARN("No data delivered to connection with " + Name);
    _connection->flush();
    _connection->close();
}

} // namespace evtools
