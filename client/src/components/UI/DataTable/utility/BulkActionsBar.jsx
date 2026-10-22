import { FaXmark } from "react-icons/fa6";
import Button from "../../Button/Button";

const BulkActionsBar = ({ actionSets, table }) => {
    return (
        <div className="BulkActionsBar flex gap-05em center">
            <div className="left-side flex center">
                <Button variant="icon" styleName="cancel-btn" onClick={() => table?.toggleAllRowsSelected(false)}>
                    <FaXmark />
                </Button>
                <span>{`${table?.getSelectedRowModel?.()?.rows?.length || 0} selected`}</span>
            </div>
            <div className="right-side flex gap-05em center">{actionSets.map((action,index)=><Button key={index} variant="link inverse" onClick={()=>action.callBack()}>{action?.label}</Button>)}</div>
        </div>
    );
};

export default BulkActionsBar;

