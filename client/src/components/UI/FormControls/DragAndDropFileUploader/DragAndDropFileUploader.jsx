import { useEffect, useRef, useState } from "react";
import "./DragAndDropFileUploader.css";
import { FaUpload } from "react-icons/fa6";
import Button from "../../Button/Button";

const DragAndDrop = ({
  files,
  onChange, // signals to parent only
  onValidationChange,
  includeBrowserBtn = true,
  width,
  height,
  maxFiles,
  maxSize, //in bytes
  accept,
  acceptOnlyInfoText,
  customStyleClass,
  ...props
}) => {
  const [uploadFiles, setUploadFiles] = useState(files||[]);
  const [isDragOver, setIsDragOver] = useState(false);
  const imageInput = useRef();

  const [errorMessage, setErrorMessage] = useState("");

  // TODO
  // add format validation
  // test them
  const validateFiles = (files) => {
    if (files.length > maxFiles) {
      return `You can upload a maximum of ${maxFiles} files.`;
    }
    for (const file of files) {
      if (maxSize && file.size > maxSize) {
        return `File ${file.name} exceeds the maximum size of ${
          maxSize / (1024 * 1024)
        }MB.`;
      }
    }
  };

  const handleInputClick = () => {
    imageInput.current.click();
  };

  const handleChange = (e) => {
    const selectedFiles = e.target.files;
    const errorMessage = validateFiles(selectedFiles);
    setErrorMessage(errorMessage);
    setUploadFiles(errorMessage ? [] : [...selectedFiles]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);

    const droppedFiles = e.dataTransfer.files;

    imageInput.current.files = droppedFiles;
    imageInput.current.dispatchEvent(new Event("change", { bubbles: true }));
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  // signals to parent component
  useEffect(() => {
    onChange(uploadFiles);
  }, [uploadFiles]);

  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(!errorMessage);
    }
  }, []);
  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(!errorMessage);
    }
  }, [errorMessage, onValidationChange]);

  return (
    <>
      <div
        className={`DragAndDrop  `}
        style={{ width: width, height: height }}
      >
        <div
          className={`drop-target ${isDragOver? "dragging-over":''}`}
          onDragOver={(e) => {
            e.preventDefault();
          }}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="icon upload-icon">
            <FaUpload />
          </div>
          <div className="drag-and-drop-text">Drag and drop files here</div>
          <div className="or-broder">
            <div className="line" ></div>
            <span className="or" >OR</span>
            <div className="line" ></div>
          </div>
          {includeBrowserBtn && (
            <Button variant='primary' onClick={handleInputClick}>Browser files</Button>
          )}
          <div className="accept-info-text" style={{color:'#0f0f0f'}}>
            {acceptOnlyInfoText ||
              `Supported formats: ${accept}`}
          </div>
        </div>

        <input
          type="file"
          ref={imageInput}
          onChange={handleChange}
          hidden
          multiple={maxFiles > 1}
          accept={accept}
          {...props}
        />
        {uploadFiles.length > 0 && (
          <div className="file-list">
            {uploadFiles.map((file, index) => (
              <div key={index} className="file-item">
                {file.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default DragAndDrop;
