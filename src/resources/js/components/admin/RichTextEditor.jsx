import { useMemo } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import 'tinymce/tinymce';
import 'tinymce/icons/default';
import 'tinymce/themes/silver';
import 'tinymce/models/dom';
import 'tinymce/plugins/code';
import 'tinymce/plugins/image';
import 'tinymce/skins/ui/oxide/skin.min.css';
import contentUiCss from 'tinymce/skins/ui/oxide/content.min.css?inline';
import contentCss from 'tinymce/skins/content/default/content.min.css?inline';
import useTinyMceLanguage from '../../hooks/useTinyMceLanguage';
import { uploadEditorImage } from '../../services/editorImages';

const editorBaseInit = {
    skin: false,
    content_css: false,
    content_style: `${contentUiCss}\n${contentCss}`,
    plugins: 'code image',
    toolbar: 'undo redo | blocks | bold italic | alignleft aligncenter alignright alignjustify | outdent indent | image code',
    images_upload_handler: (blobInfo) => uploadEditorImage(blobInfo.blob(), blobInfo.filename()),
};

export default function RichTextEditor({ instanceKey, value, onChange, disabled = false }) {
    const editorLanguage = useTinyMceLanguage();
    const editorInit = useMemo(() => ({
        ...editorBaseInit,
        ...editorLanguage,
    }), [editorLanguage]);

    return (
        <Editor
            key={`${instanceKey}-${editorLanguage.language}`}
            licenseKey="gpl"
            init={editorInit}
            value={value}
            onEditorChange={onChange}
            disabled={disabled}
        />
    );
}
