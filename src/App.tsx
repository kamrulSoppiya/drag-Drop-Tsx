import React, { useEffect, useState } from "react";
import classes from './assets/fileUp.module.scss';

interface ImageUploaderProps {
  onImageUpload: (file: File, base64Img: string) => void;
  imgFormat: string[];
  setTime?:number;
}

const ImageUploader = ({ onImageUpload, imgFormat, setTime }:ImageUploaderProps) => {

  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<{ status: boolean, msg: string }>({
    status: false, msg: ''
  });

  // Drag And Drop
  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(true);
  };

  // Function for base64 and Data onLoad   
  const dataOnLoad = (file: File) => {
    if (file && isSupportedImageFormat(file, imgFormat)) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Image = event.target!.result as string;
        setSelectedFile(base64Image);
        onImageUpload(file, base64Image);
      };
      reader.readAsDataURL(file);
    } else {
      setError(
        {
          status: true,
          msg: `File type is not valid`
        });
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(false);
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    dataOnLoad(file);
  };

  //  Image Uploader
  const handleImageUploader = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files![0];
    dataOnLoad(file as File);
  };

  const isSupportedImageFormat = (file: File, imgFormat: string[]) => {
    const conCatData = imgFormat.map(element => 'image/' + element);
    return conCatData.includes(file.type)
  };

  console.log(setTime);

  useEffect(() => {
    if (!error.status) return;
    const timer = setTimeout(() => {
      setError({ status: false, msg: '' })
    }, setTime?setTime:400 )

    return () => clearTimeout(timer)

  }, [error.status, setTime])

  return (
    <div className={classes.row}>
      <div className={classes.container}>
        {error.status && <div className={classes.containerUnvalid}>
          <div className={classes.content}>
            <p>{error.msg}</p>
          </div>
        </div>}

        {!error.status && <div className={`{drop-zone ${isDragging ? 'dragging' : ''}} ${classes.containerItem}`} onDrop={handleDrop} onDragEnter={handleDragEnter} onDragOver={event => event.preventDefault()}>
          <label htmlFor="file-input" className="custom-file-label">
            <h6 className={classes.btnDrag}>Add images</h6>
          </label>
          <input type="file" accept={imgFormat.join(',')} onChange={handleImageUploader} style={{ display: 'none' }} id="file-input" />
          <p>or darg and drop</p>
        </div>}

        {selectedFile && (
          <div className="image-preview" style={{ width: "200px" }}>
            <img src={selectedFile} alt="Uploaded" style={{ width: "200px" }} />
          </div>
        )}
      </div>
    </div>
  );
};

const App = () => {
  const handleImageUpload = (file: File, base64Img: string) => {
    console.log('Uploaded File:', file);
    console.log('Base64:', base64Img);
  };

  const imgFormat: string[] = ["jpg", "jpeg", "png"];

  return (
    <ImageUploader onImageUpload={handleImageUpload} imgFormat={imgFormat} setTime={12000}/>
  );
}

export default App;
