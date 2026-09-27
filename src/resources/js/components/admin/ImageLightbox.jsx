import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';

const lightboxPlugins = [Zoom];

export default function ImageLightbox({ images = [], index = 0, open = false, onClose, onIndexChange }) {
    const { t } = useTranslation();
    const slides = useMemo(() => images
        .map((image) => (typeof image === 'string' ? { src: image } : image))
        .filter((image) => image?.src), [images]);
    const safeIndex = Math.min(Math.max(index, 0), Math.max(slides.length - 1, 0));

    return (
        <Lightbox
            open={open && slides.length > 0}
            close={onClose}
            slides={slides}
            index={safeIndex}
            plugins={lightboxPlugins}
            zoom={{ scrollToZoom: true }}
            controller={{ closeOnBackdropClick: true }}
            on={{ view: ({ index: activeIndex }) => onIndexChange?.(activeIndex) }}
            labels={{
                Previous: t('imageLightbox.previous'),
                Next: t('imageLightbox.next'),
                Close: t('imageLightbox.close'),
                Lightbox: t('imageLightbox.title'),
                Carousel: t('imageLightbox.carousel'),
                'Photo gallery': t('imageLightbox.gallery'),
                Slide: t('imageLightbox.slide'),
                '{index} of {total}': t('imageLightbox.position'),
                'Zoom in': t('imageLightbox.zoomIn'),
                'Zoom out': t('imageLightbox.zoomOut'),
            }}
        />
    );
}
