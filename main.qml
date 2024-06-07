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
        width: parent.width
        height: parent.height
        visible: true
        color: "#f0f0f0"

        Column {
            anchors.centerIn: parent
            spacing: 20
        }
    }
}
