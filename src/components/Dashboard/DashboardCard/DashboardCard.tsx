import { localFormatDate } from 'src/lib/localFormatDate';
import { TutorialCard } from '../types';

interface DashboardCardProps {
    item: TutorialCard;
}

const DashboardCard = (props: DashboardCardProps) => {
    const { item } = props;
    return (
        <div className="flex w-[calc(25%-18px)]  flex-col gap-y-4 rounded-[4px] bg-background-aliceBlue p-4">
            <div className="flex flex-row items-center justify-between">
                <span className="rounded-[4px] border border-secondary-cornYellow bg-tertiary-cornYellow px-2 py-[6px] text-xs capitalize leading-5">
                    {item.type}
                </span>
                <div className=" flex flex-row gap-x-2 [&>button]:h-6 [&>button]:w-6 [&>button]:rounded-[4px] [&>button]:bg-white [&>button]:p-1">
                    <button>
                        <img src="/img/dashboardCard/view.svg" alt="" />
                    </button>
                    <button>
                        <img src="/img/dashboardCard/edit.svg" alt="" />
                    </button>
                    <button>
                        <img src="/img/dashboardCard/delete.svg" alt="" />
                    </button>
                    <button>
                        <img src="/img/dashboardCard/copy.svg" alt="" />
                    </button>
                </div>
            </div>
            <div className="flex flex-col gap-y-6">
                <h4 className="text-xl leading-8">{item.name}</h4>
                <div className="flex flex-col gap-y-2 pb-16 [&>div]:flex [&>div]:flex-row">
                    <div>
                        <p className="w-20 text-left text-primary-subtext">
                            Published
                        </p>
                        {localFormatDate(item.published)}
                    </div>
                    <div>
                        <p className="w-20 text-left text-primary-subtext">
                            Last Edit
                        </p>
                        {localFormatDate(item.lastEdit)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardCard;
