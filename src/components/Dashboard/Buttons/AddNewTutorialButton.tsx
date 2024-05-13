import { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from 'src/components/ui/Dialog';

const AddNewTutorialButton = () => {
    const [activeButton, setActiveButton] = useState<string | undefined>(
        undefined
    );
    const buttons: Array<string> = [
        'Course Page',
        'Subject Page',
        'Software Page',
        'Tutorial Page',
    ];
    const handleChangeButton = (item: string) => {
        if (activeButton === item) {
            setActiveButton(undefined);
        } else {
            setActiveButton(item);
        }
    };

    const handleSubmit = () => {
        console.log("Navigate to page with '" + activeButton + "' template");
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="flex flex-row gap-x-6 rounded-[4px] bg-primary-skyBlue px-6 py-3 text-white">
                    <div className="text-2xl leading-6">+</div>
                    <p className="text-base">Create new tutorial</p>
                </button>
            </DialogTrigger>
            <DialogContent className="bg-white sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>What are you creating?</DialogTitle>
                </DialogHeader>
                <div className="flex w-full flex-row flex-wrap gap-x-6 gap-y-6 pb-20">
                    {buttons.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => handleChangeButton(item)}
                            className={`${
                                item === activeButton
                                    ? 'border-primary-skyBlue'
                                    : 'border-transparent'
                            } w-[calc(50%-12px)] border bg-background-aliceBlue px-6 py-11 text-left text-xl leading-8 transition-colors duration-200`}
                        >
                            {item}
                        </button>
                    ))}
                </div>
                <DialogFooter>
                    <button
                        disabled={!activeButton}
                        onClick={handleSubmit}
                        className="flex flex-row gap-x-6 rounded-[4px] bg-primary-skyBlue px-6 py-3 text-white transition-colors duration-200 disabled:bg-tertiary-skyBlue-20"
                    >
                        <p className="text-base">Start</p>
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddNewTutorialButton;
