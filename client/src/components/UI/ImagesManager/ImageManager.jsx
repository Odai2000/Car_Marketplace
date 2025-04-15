import { useEffect, useState } from "react";
import DragAndDrop from "../FormControls/DragAndDropFileUploader/DragAndDropFileUploader";
import "./ImageManager.css";
import Button from "../Button/Button";
import { FaXmark } from "react-icons/fa6";

const ImageManager = ({
  imageObjects,
  files,
  onChange,
  onDrop,
  accept,
  maxFiles,
  maxSize,
  onClick,
}) => {
  const [imageState, setImageState] = useState({
    files: [], // File
    toRemove: [], // imageId
    previews: [], // imageObject
  });

  const generateFileId = (file) => {
    return `file-${file.name}-${file.size}-${file.lastModified}`; // DIY solution
  };

  const handleRemove = (preview) => {
    if (preview.imageId.startsWith("file-")) {
      setImageState((prev) => ({
        ...prev,
        files: prev.files.filter(
          (file) => generateFileId(file) !== preview.imageId
        ),
        previews: prev.previews.filter(
          (item) => item.imageId !== preview.imageId
        ),
      }));
    } else {
      setImageState((prev) => ({
        ...prev,
        toRemove: [...prev.toRemove, preview.imageId],
        previews: prev.previews.filter(
          (item) => item.imageId !== preview.imageId
        ),
      }));
    }
  };

  useEffect(() => {
    setImageState({
      files: [...files],
      toRemove: [],
      previews: [
        ...imageObjects,
        ...files.map((file) => ({
          imageId: generateFileId(file),
          imageURL: URL.createObjectURL(file),
        })),
      ],
    });

    return () => {
      files.forEach((file) => URL.revokeObjectURL(URL.createObjectURL(file)));
    };
  }, []);

  useEffect(() => {
    if (imageState.files.length > 0) {
      const existingIds = new Set(imageState.previews.map((p) => p.imageId));

      const newPreviews = imageState.files
        .filter((file) => {
          const fileId = generateFileId(file);
          return !existingIds.has(fileId);
        })
        .map((file) => ({
          imageId: generateFileId(file),
          imageURL: URL.createObjectURL(file),
        }));

      if (newPreviews.length > 0) {
        setImageState((prev) => ({
          ...prev,
          previews: [...prev.previews, ...newPreviews],
        }));
      }

      return () => {
        newPreviews.forEach((preview) => URL.revokeObjectURL(preview.imageURL));
      };
    }
  }, [imageState.files]);

  useEffect(() => {
    if (onChange) {
      onChange(imageState);
    }
  }, [imageState]);

  return (
    <>
      <div className="ImageManager">
        <div className="dnd">
          <DragAndDrop
            files={files}
            accept={accept}
            maxFiles={maxFiles}
            maxSize={maxSize}
            // onClick={onClick}
            onChange={(files) => {
              setImageState((prev) => ({
                ...prev,
                files: [...prev.files, ...files],
              }));
            }}
          />
        </div>
        <div className="preview-list">
            {imageState.previews.map((preview) => (
              <div className="preview" key={preview.imageId}>
                <Button
                  styleName="cancel-btn"
                  variant="icon"
                  onClick={() => {
                    handleRemove(preview);
                  }}
                >
                  <FaXmark />
                </Button>
                <img src={preview.imageURL} alt="image's preview" />
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default ImageManager;
