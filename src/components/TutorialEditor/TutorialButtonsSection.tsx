import React from 'react';
import { Button } from 'src/components/ui/Button';

const TutorialButtonsSection = () => {
    return (
        <section className="flex w-full flex-row items-center justify-end gap-x-6 py-14">
            <Button variant={'outline'} size={'lg'}>
                <p>Preview</p>
            </Button>
            <Button variant={'outline'} size={'lg'}>
                <p>Save as draft</p>
            </Button>
            <Button size={'lg'}>
                <p>Publish</p>
            </Button>
        </section>
    );
};

export default TutorialButtonsSection;
