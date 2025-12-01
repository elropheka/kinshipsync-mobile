import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

export interface RichTextEditorRef {
  setContent: (content: string) => void;
  getContent: () => Promise<string>;
}

interface RichTextEditorProps {
  initialContent?: string;
  onChangeContent?: (text: string) => void;
  placeholder?: string;
  minHeight?: number;
}

const RichTextEditor = forwardRef<RichTextEditorRef, RichTextEditorProps>(({
  initialContent = '',
  onChangeContent,
  placeholder = 'Start typing...',
  minHeight = 200
}, ref) => {
  const richText = useRef<RichEditor>(null);

  useImperativeHandle(ref, () => ({
    setContent: (content: string) => {
      richText.current?.setContentHTML(content);
    },
    getContent: async () => {
      return richText.current?.getContentHtml() || '';
    }
  }));

  const editorInitializedCallback = () => {
    if (initialContent) {
      richText.current?.setContentHTML(initialContent);
    }
  };

  const toolbarActions = [
    actions.setBold,
    actions.setItalic,
    actions.setUnderline,
    actions.heading1,
    actions.heading2,
    actions.insertBulletsList,
    actions.insertOrderedList,
    actions.insertLink,
    actions.alignLeft,
    actions.alignCenter,
    actions.alignRight,
    'clear'
  ];

  type CustomAction = {
    iconName: 'trash-outline';
    action: () => void;
  };

  const customActions: { [key: string]: CustomAction } = {
    clear: {
      iconName: 'trash-outline',
      action: () => richText.current?.setContentHTML('')
    }
  };

  const renderAction = (action: string, selected: boolean) => {
    if (action in customActions) {
      return (
        <TouchableOpacity
          style={[styles.toolbarButton, selected && styles.toolbarButtonSelected]}
          onPress={customActions[action].action}
        >
          <Ionicons
            name={customActions[action].iconName}
            size={20}
            color={selected ? Colors.light.primary : Colors.light.text}
          />
        </TouchableOpacity>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <RichToolbar
        editor={richText}
        actions={toolbarActions}
        iconMap={customActions}
        renderAction={renderAction}
        selectedIconTint={Colors.light.primary}
        iconTint={Colors.light.text}
        style={styles.toolbar}
      />
      <RichEditor
        ref={richText}
        placeholder={placeholder}
        initialContentHTML={initialContent}
        onChange={onChangeContent}
        useContainer={true}
        initialHeight={minHeight}
        editorInitializedCallback={editorInitializedCallback}
        editorStyle={styles.editor}
        style={[styles.richEditor, { minHeight }]}
      />
    </View>
  );
});

RichTextEditor.displayName = 'RichTextEditor';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.backgroundPaper,
  },
  toolbar: {
    backgroundColor: Colors.light.backgroundPaper,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  toolbarButton: {
    padding: 8,
  },
  toolbarButtonSelected: {
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 4,
  },
  richEditor: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    backgroundColor: Colors.light.backgroundPaper,
  },
  editor: StyleSheet.create({
    style: {
      backgroundColor: Colors.light.backgroundPaper,
      color: Colors.light.text,
    }
  }).style,
});

export default RichTextEditor;
