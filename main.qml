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
            width: parent.width * 0.9
            anchors.centerIn: parent
            spacing: 20
            // How to implement?
            // padding: 20

            Rectangle {
                width: parent.width
                height: 50
                color: "#ffffff"  // background color for rectangles
                radius: 10
                border.color: "#cccccc"  // border color

                Text {
                    anchors.centerIn: parent
                    text: "Local IP: 192.168.1.1"  // Placeholder text
                    font.pixelSize: 20
                    color: "#333333"  // font color
                }
            }

            Rectangle {
                width: parent.width * 0.9
                height: 50
                color: "blue"
            }

        }
    }
}
