import React from 'react'
import { MediaObjectInterface } from 'src/types/types'
import { FileIcon } from '../ui/Icons'

interface MediaPreviewTemplateProps {
  item: MediaObjectInterface | { url: string; type: string }
  styles: string
}

const MediaPreviewTemplate = (props: MediaPreviewTemplateProps) => {
  if (props.item.type === 'image') {
    return (
      <img
        src={props.item.url}
        alt={props.item.url}
        className={`${props.styles} aspect-video object-center object-cover`}
      />
    )
  } else if (props.item.type === 'video') {
    return (
      <div className={`${props.styles} h-full relative flex !flex-col items-center gap-3`}>
        <video
          controls
          src={props.item.url}
          preload="metadata"
          className="aspect-video w-full"
        ></video>
        {/* {props.item.url && (
          <p className="text-primary-skyBlue font-medium break-all text-small">
            {props.item.url.split('/').pop()}
          </p>
        )} */}
      </div>
    )
  } else {
    return (
      <div className={`${props.styles} h-full flex justify-center items-center flex-col`}>
        <div className="relative flex flex-col items-center gap-3">
          <FileIcon />
          {props.item.url && (
            <p className="text-primary-skyBlue font-medium break-all text-small">
              {props.item.url.split('/').pop()}
            </p>
          )}
        </div>
      </div>
    )
  }
}

export default MediaPreviewTemplate
