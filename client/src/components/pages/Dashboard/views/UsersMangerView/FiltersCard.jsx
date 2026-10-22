import CheckBoxes from "@/components/UI/FormControls/CheckBoxes/CheckBoxes";
import Input from "@/components/UI/FormControls/Input";
import Select from "@/components/UI/FormControls/Select";

const FiltersCard = ({ filters }) => {
  return (
    <div className="FiltersCard flex-col center gap-1em">
      {filters?.map((filter, index) => {
        let field = "";

        switch (filter.type) {
          case "text":
            field = (
              <Input
                type="text"
                value={filter.value}
                placeholder={filter.placeholder}
                onChange={(e)=>filter.onChange(e.target.value)}
              />
            );
            break;
          case "select":
            field = (
              <Select
                options={filter.options || []}
                value={filter.value}
                onChange={(e)=>filter.onChange(e.target.value)}
              />
            );
            break;
          case "multiple":
            field = (
              <CheckBoxes
                options={filter.options || []}
                value={filter.value}
                 onChange={(e) => filter.onChange(e.target.value || e || [])}
              />
            );
            break;
          case "numerical-range":
            field = (
              <>
                <Select
                  value={filter.startValue}
                  defaultOption={{ label: "from" }}
                  options={filter.options || []}
                  onChange={e=>filter.onMinValueChange(e.target.value)}
                ></Select>
                <Select
                  value={filter.endValue}
                  defaultOption={{ label: "to" }}
                  options={filter.options || []}
                  onChange={e=>filter.onMaxValueChange(e.target.value)}
                ></Select>
              </>
            );
            break;
          case "date-range":
            field = (
              <>
                <input
                  type="date"
                  value={filter.startValue}
                  placeholder={filter.placeholder || "Enter valuee..."}
                  onChange={e=>filter.onStartDateChange(e.target.value)}
                />
                <input
                  type="date"
                  value={filter.endValue}
                  placeholder={filter.placeholder || "Enter value..."}
                  onChange={e=>filter.onEndDateChange(e.target.value)}
                />
              </>
            );
            break;
          default:
            field = (
              <Input
                type="text"
                value={filter.value}
                placeholder={filter.placeholder || "Enter valued..."}
                onChange={e=>filter.onChange(e.target.value)}
              />
            );
        }

        return (
          <div className="filter" key={index}>
            <label>{filter.label}: </label>
            {field}
          </div>
        );
      })}
    </div>
  );
};

export default FiltersCard;
