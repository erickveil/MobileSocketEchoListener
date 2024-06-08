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
                id: portContainer
                width: parent.width
                height: 50
                color: "#ffffff"
                radius: 10
                border.color: "#cccccc"

                Row {
                    height: parent.height
                    anchors.centerIn: parent
                    spacing: 10

                    Text {
                        text: "Port:"
                        font.pixelSize: 20
                        color: "#333333"
                        anchors.verticalCenter: portContainer.verticalCenter
                    }

                    TextField {
                        id: portNumber
                        text: "8080"
                        validator: IntValidator {
                            bottom: 1024
                            top: 49151
                        }
                        width: 100
                    }
                }

            }

            Rectangle {
                id: listenerSwitchContainer
                width: parent.width
                height: 50
                color: "#ffffff"
                radius: 10
                border.color: "#cccccc"

                Row {
                    anchors.centerIn: parent
                    spacing: 10
                }
            }

        }
    }
}
