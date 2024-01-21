import { Button, Card, Text, Divider, Modal } from "@ui-kitten/components";
import { StyleSheet } from "react-native";
import React from "react";

export function AuthDialog(props: {
  visible: boolean;
  message: string;
  onClose: () => void;
}) {
  return (
    <Modal
      visible={props.visible}
      backdropStyle={styles.backdrop}
      onBackdropPress={props.onClose}
    >
      <Card disabled={true}>
        <Text style={styles.marginBottom} category="h6">
          🚨 Oups !
        </Text>
        <Text>{props.message}</Text>
        <Divider style={{ marginTop: 10 }} />
        <Button
          size="small"
          appearance="ghost"
          style={styles.closeButton}
          onPress={() => props.onClose()}
        >
          ❌ Fermer
        </Button>
      </Card>
    </Modal>
  );
}

const styles = StyleSheet.create({
  marginBottom: {
    marginBottom: 15,
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  closeButton: {
    marginTop: 10,
  },
});
