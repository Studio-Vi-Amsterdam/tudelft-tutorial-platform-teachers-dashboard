import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogFooter } from '../ui/Dialog';
import {
    FilterIcon,
    GalleryBlockViewIcon,
    GalleryListViewIcon,
    SearchIcon,
    SortIcon,
} from '../ui/Icons';
import GalleryBlockView from './GalleryBlockView';
import GalleryListView from './GalleryListView';
import PaginationBar from './PaginationBar';
import { Button } from '../ui/Button';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { RootState } from 'src/redux/store';
import {
    setElementImage,
    setElementVideo,
} from 'src/redux/features/editorSlice';
import { AddMediaElementProps, MediaObjectInterface } from 'src/types/types';

interface PickMediaDialogProps extends AddMediaElementProps {
    dialogOpened: boolean;
    setDialogOpened: React.Dispatch<React.SetStateAction<boolean>>;
}

const PickMediaDialog = (props: PickMediaDialogProps) => {
    const { dialogOpened, setDialogOpened, mediaType } = props;

    //temp const that imit props data about count of media on page
    const propsItemsPerPage: number = 6;
    const [itemsPerPage, setItemsPerPage] = useState<number>(propsItemsPerPage);
    const [viewType, setViewType] = useState<'block' | 'list'>('block');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectedMedia, setSelectedMedia] = useState<
        MediaObjectInterface | undefined
    >(undefined);

    const dispatch = useAppDispatch();

    const media = useAppSelector(
        (state: RootState) => state.media.media
    ).filter((item) => item.type === mediaType);

    useEffect(() => {
        if (viewType === 'block') {
            setItemsPerPage(propsItemsPerPage);
        } else if (viewType === 'list') {
            setItemsPerPage(3);
        }
    }, [viewType]);

    const totalPages: number = Math.ceil(media.length / itemsPerPage);

    const handleSelectMedia = (item: MediaObjectInterface) => {
        if (selectedMedia === item) {
            setSelectedMedia(undefined);
        } else {
            setSelectedMedia(item);
        }
    };

    const handleClick = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const handlePrevClick = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextClick = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handleSubmitMedia = () => {
        if (selectedMedia) {
            if (props.mediaType === 'image') {
                dispatch(
                    setElementImage({
                        block: props.block,
                        nestedIndex: props.chapterIndex,
                        image: selectedMedia,
                        index: props.listIndex,
                        subchapterIndex: props.subchapterIndex,
                    })
                );
            } else if (props.mediaType === 'video') {
                dispatch(
                    setElementVideo({
                        block: props.block,
                        nestedIndex: props.chapterIndex,
                        video: selectedMedia,
                        index: props.listIndex,
                        subchapterIndex: props.subchapterIndex,
                    })
                );
            }
        }
        setDialogOpened(false);
        setSelectedMedia(undefined);
    };
    const store = useAppSelector((state: RootState) => state.editor);

    useEffect(() => {
        console.log(store);
    }, [store]);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const currentItems = media.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <Dialog open={dialogOpened} onOpenChange={setDialogOpened}>
            <DialogContent className="w-full max-w-5xl flex-col bg-white pt-20">
                <div className="flex flex-row items-center justify-between">
                    <div className="flex flex-row items-center justify-start gap-x-6 [&>button]:flex [&>button]:flex-row [&>button]:gap-x-4 [&>button]:rounded-[4px] [&>button]:bg-background-aliceBlue [&>button]:p-2">
                        <button
                            className={
                                viewType === 'block'
                                    ? '!bg-tertiary-skyBlue-10 text-primary-skyBlue'
                                    : 'text-tertiary-grey-dim'
                            }
                            onClick={() => setViewType('block')}
                        >
                            <GalleryBlockViewIcon
                                color={
                                    viewType === 'block' ? '#00A6D6' : '#67676B'
                                }
                            />
                            {viewType !== 'block' && <p>Gallery View</p>}
                        </button>
                        <button
                            className={
                                viewType === 'list'
                                    ? '!bg-tertiary-skyBlue-10 text-primary-skyBlue'
                                    : 'text-tertiary-grey-dim'
                            }
                            onClick={() => setViewType('list')}
                        >
                            <GalleryListViewIcon
                                color={
                                    viewType === 'list' ? '#00A6D6' : '#67676B'
                                }
                            />
                            {viewType !== 'list' && <p>List View</p>}
                        </button>
                    </div>
                    <div className="flex flex-row items-center justify-end [&>div:first-child]:before:!hidden [&>div>button]:flex [&>div>button]:flex-row [&>div>button]:items-center [&>div>button]:gap-x-6 [&>div]:relative [&>div]:before:absolute [&>div]:before:left-0 [&>div]:before:h-full [&>div]:before:w-[1px] [&>div]:before:bg-tertiary-skyBlue-20">
                        <div className="pr-6">
                            <button className="px-4">
                                <p>Search</p>
                                <SearchIcon color="#000000" />
                            </button>
                        </div>
                        <div className="px-6">
                            <button className="px-4 py-2">
                                <p>Sort</p>
                                <SortIcon color="#000000" />
                            </button>
                        </div>
                        <div className="pl-6">
                            <button className="px-4 py-2">
                                <p>Filter</p>
                                <FilterIcon color="#000000" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-y-10">
                    {viewType === 'block' && (
                        <GalleryBlockView
                            currentItems={currentItems}
                            handleSelectMedia={handleSelectMedia}
                            selectedMedia={selectedMedia}
                        />
                    )}
                    {viewType === 'list' && (
                        <GalleryListView
                            currentItems={currentItems}
                            handleSelectMedia={handleSelectMedia}
                            selectedMedia={selectedMedia}
                        />
                    )}
                    <PaginationBar
                        currentPage={currentPage}
                        handleClickPage={handleClick}
                        handleNextClick={handleNextClick}
                        handlePrevClick={handlePrevClick}
                        totalPages={totalPages}
                    />
                </div>
                <DialogFooter>
                    <Button
                        onClick={handleSubmitMedia}
                        disabled={!selectedMedia}
                    >
                        <p>Save</p>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default PickMediaDialog;
