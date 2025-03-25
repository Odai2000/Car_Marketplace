import { useEffect } from "react";
import Input from "../../../UI/FormControls/Input";

const BasicInfoStep = ({ formData, setFormData ,isSmallScreen,setControlsValidity,handleValidateChange}) => {
    useEffect(() => {
      setControlsValidity({
        title: !!formData.title,
        price: !!formData.price,
      });
      }, []);

  return (
    <>
      <Input
        type="text"
        name="title"
        value={formData.title}
        onChange={(e) => setFormData({...formData,[e.target.name]:e.target.value})}
        placeholder="Title"
        styleName={!isSmallScreen ? "col-2" : ""}
        validationRules={{ required: true, minLength: 2, maxLength: 80 }}
        onValidationChange={(value) => handleValidateChange("title", value)}
      />
      <Input
        type="text"
        name="price"
        value={formData.price}
        onChange={(e) => setFormData({...formData, [e.target.name]:e.target.value})}
        placeholder="Price"
        validationRules={{ required: true, maxLength: 9, numeric: true }}
        onValidationChange={(value) => handleValidateChange("price", value)}
      />
    </>
  );
};

export default BasicInfoStep;
