import React from 'react';
import { GalleryViewProps } from 'src/types/types';

const GalleryBlockView = (props: GalleryViewProps) => {
    const { currentItems, selectedMedia, handleSelectMedia } = props;

    return (
        <div className="flex w-full flex-row flex-wrap gap-x-6 gap-y-6 ">
            {currentItems.map((item, index) => (
                <button
                    key={index}
                    className={`${
                        selectedMedia === item ? '' : 'before:!hidden'
                    } relative w-[calc(33%-13px)] before:absolute before:left-0 before:top-0 before:h-full before:w-full before:bg-black before:opacity-50`}
                    onClick={() => handleSelectMedia(item)}
                >
                    <img
                        src={item.link}
                        alt={item.title}
                        className="object-cover object-center"
                    />
                </button>
            ))}
        </div>
    );
};

export default GalleryBlockView;
