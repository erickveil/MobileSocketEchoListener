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

    // TODO: Handle Screen Rotation
    // This is not working:
    /*
    onWidthChanged: updateLayout()
    onHeightChanged: updateLayout()

    function updateLayout() {
        if (Screen.primaryOrientation === Screen.Landscape) {
            column.with = parent.height * 0.9
        }
        else {
            column.width = parent.witdth * 0.9
        }
    }
    */

    Rectangle {
        width: parent.width
        height: parent.height
        visible: true
        color: "#f0f0f0"

        Column {
            id: column
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
                        text: "50502"
                        validator: IntValidator {
                            bottom: 1024
                            top: 49151
                        }
                        width: 100
                        // Disable editing while listening
                        enabled: !listenerSwitch.checked
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

                    Text {
                        text: "Start Listener"
                        font.pixelSize: 20
                        color: "#333333"
                        anchors.verticalCenter: listenerSwitchContainer.verticalCenter
                    }

                    Switch {
                        id: listenerSwitch
                        checked: false
                        onCheckedChanged: {
                            if (checked) {
                                controller.startListener(parseInt(portNumber.text));
                            }
                            else {
                                controller.stopListener();
                            }
                        }
                    }
                }
            }

            Rectangle {
                width: parent.width
                height: parent.height * 0.65
                color: "#ffffff"
                radius: 10
                border.color: "#cccccc"

                ListView {
                    id: messageListView
                    width: parent.width * 0.95
                    height: parent.height
                    model: ListModel {
                        ListElement {
                            timestamp: "12:00"
                            message: "Hello World"
                        }
                    }

                    delegate: Item {
                        width: parent.width
                        height: 40

                        Row {
                            spacing: 10
                            Text {
                                text: model.timestamp
                                font.pixelSize: 14
                                color: "#333333"
                            }
                            Text {
                                text: model.message
                                font.pixelSize: 14
                                color: "#333333"
                            }
                        }
                    }

                    ScrollIndicator.vertical: ScrollIndicator {}
                }
            }

        }
    }
}
