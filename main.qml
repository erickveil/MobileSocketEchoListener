import QtQuick
import QtQuick.Layouts
import QtQuick.Controls

ApplicationWindow {
    id: mainWindow
    width: 450
    height: 900
    visible: true
    color: "lightblue"
    title: qsTr("Basic QML")

    Rectangle {
        width: 100
        height: 100
        visible: true
        color: "red"
        anchors.centerIn: parent
    }
}
