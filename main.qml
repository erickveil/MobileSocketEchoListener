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

    ListModel {
        id: messageModel
    }

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
                    text: controller.localIpAddress
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
                        // Can only anchor to a parent...
                        //anchors.verticalCenter: portContainer.verticalCenter
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
                        //anchors.verticalCenter: listenerSwitchContainer.verticalCenter
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
                    model: messageModel

                    delegate: Item {
                        width: parent.width
                        height: 40

                        Column {
                            width: parent.width
                            spacing: 5

                            Rectangle {
                                id: entryContainer
                                width: parent.width
                                height: implicitHeight
                                color: index % 2 == 0 ? "white" : "lightblue"

                                Column {
                                    width: parent.width
                                    spacing: 5
                                    Text {
                                        text: model.timestamp
                                        font.pixelSize: 14
                                        color: "blue"
                                    }
                                    Text {
                                        text: model.message
                                        font.pixelSize: 14
                                        wrapMode: Text.WordWrap
                                        color: "black"
                                        width: parent.width
                                        onImplicitHeightChanged: {
                                            console.log("onImplicitHeightChanged: " + implicitHeight);
                                            entryContainer.height = implicitHeight + 10
                                        }
                                    }
                                }
                            }
                        }
                    }

                    ScrollIndicator.vertical: ScrollIndicator {}
                }
            }
        }
    }

    Connections {
        target: controller
        onPostInfo: {
            messageModel.append( { "timestamp": timestamp, "message": message } );
        }

    }
}
