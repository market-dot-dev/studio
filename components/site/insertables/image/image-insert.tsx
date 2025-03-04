'use client';
import { useModal } from "@/components/modal/provider";
import { uploadFile, listMedia, deleteMedia } from "@/app/services/MediaService"; import { useState, useEffect, useCallback } from "react";
import { Media as DBMedia } from "@prisma/client";
import { Button,  NumberInput, Title, TextInput, Bold } from "@tremor/react";
import { format } from 'date-fns'

import { useDropzone } from 'react-dropzone';
import { Spinner } from "flowbite-react";

type Media = Partial<DBMedia>;

const StyledDropzone = ({ onFileAccepted, isUploading } : any) => {
    const onDrop = useCallback((acceptedFiles: any[]) => {
        // Automatically upload the first file
        if (acceptedFiles.length > 0) {
            onFileAccepted(acceptedFiles[0]);
        }
    }, [onFileAccepted]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
        <div 
            {...getRootProps()} 
            className="flex flex-col p-4 gap-2 border-2 rounded-md border-dashed dropzone cursor-pointer min-h-30"
        >
            <input {...getInputProps()} />
            <Bold>Files Upload</Bold>
            {isUploading ? <Spinner /> :
            
                <p className="text-sm text-stone-500 py-1">Drop files here or <strong>Click</strong> to select files</p>
            }
        </div>
    );
};

function ImageInsertModal({ insertAtCursor, hide }: { insertAtCursor: (prop: any) => void, hide: () => void}) {

    const [mediaList, setMediaList] = useState<Media[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    // const [isFileSelected, setIsFileSelected] = useState(false);

    const [alt, setAlt] = useState<string>('');
    const [width, setWidth] = useState<string>('');
    const [height, setHeight] = useState<string>('');

    useEffect(() => {
        async function fetchMedia() {
            setIsLoading(true);
            const media = await listMedia() as Media[];
            setMediaList(media);
            setIsLoading(false);
        }

        fetchMedia();

    }, []);


    const handleSelectMedia = (media : Media) => {
        if( isDeleting ) {
            return;
        }

        setSelectedMedia(media);
        
    };

    const handleInsertImage = useCallback(() => {
        if (selectedMedia) {
            insertAtCursor(`<img src="${selectedMedia.url}" ${ alt ? `alt="${alt}"` : '' } ${ width ? `width="${width}"` : '' } ${ height ? `height="${height}"` : '' } />`);
            hide(); 
        }
    }, [selectedMedia, insertAtCursor, hide, alt, width, height]);

    

    const handleFileUpload = async (file: any) => {
        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const newMedia = await uploadFile(formData);
            if (newMedia) {
                setMediaList([...mediaList, newMedia]);
                handleSelectMedia(newMedia);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsUploading(false);
        }
    };


    const deleteSelected = useCallback(async () => {
        if( selectedMedia?.id ) {
            try {
                setIsDeleting(true);
                const deleted = await deleteMedia(selectedMedia.id);

                if( deleted ) {
                    setMediaList((mediaList) => mediaList.filter(media => media.id !== selectedMedia.id));
                    setSelectedMedia(null);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsDeleting(false);
            }
        }
    }, [selectedMedia, setMediaList]);

    return (
        <div className="flex grow items-stretch">
            <div className="flex flex-col items-stretch">
                <div className="flex flex-col justify-center items-center w-full p-4 gap-2">
                    <StyledDropzone onFileAccepted={handleFileUpload} isUploading={isUploading} />    
                </div>

                <div className="flex justify-start items-start gap-4 grow p-4 flex-wrap max-h-[60vh] overflow-auto">
                    {isLoading && <Spinner />}
                    {mediaList.map((media) => {
                        const classes = `border ${selectedMedia?.id === media.id ? 'border-blue-500' : 'border-transparent'} cursor-pointer`;
                        return (
                            <div
                                key={media.id}
                                className={classes}
                                onClick={() => handleSelectMedia(media)}
                                style={{ width: '137px', height: '137px' }} 
                            >
                                <img src={media.url} className="object-cover w-full h-full" />
                            </div>
                        )
                    })}
                </div>
                

                
            </div>
            <div className="flex flex-col justify-between w-1/3 bg-stone-100 p-4 gap-6">
                <div className="flex flex-col grow gap-4 min-h-[60vh] justify-start">
                {selectedMedia && (
                    <>
                        <Title>Selected Image</Title>
                        <div className="flex gap-4">
                            <div style={{ width: '137px', height: '137px', flexBasis: '50%' }} >
                                <img src={selectedMedia.url} className="object-cover w-full h-full" alt="Thumbnail" />
                            </div>
                            <div className="flex flex-col gap-4 basis-1/2 items-start">
                                <p className="text-sm text-stone-500">Uploaded:<br /> {selectedMedia.createdAt ? format(new Date(selectedMedia.createdAt), 'PPP') : null}</p>
                                <Button color="red" size="xs" loading={isDeleting} disabled={isDeleting} onClick={deleteSelected}>Delete</Button>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-2">
                                <label>Alt Text</label>
                                <TextInput
                                    type="text"
                                    value={alt}
                                    onChange={(e) => setAlt(e.target.value)}
                                    placeholder="Alt Text"
                                />
                            </div>
                            
                            <div className="flex flex-col gap-2">
                                <label>Width (px)</label>
                                <NumberInput
                                    value={width}
                                    min={1}
                                    onChange={(e) => setWidth(e.target.value)}
                                    placeholder="Width"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label>Height (px)</label>
                                <NumberInput
                                    value={height}
                                    min={1}
                                    onChange={(e) => setHeight(e.target.value)}
                                    placeholder="Height"
                                />
                            </div>
                            
                        </div>
                    </>
                )}
                </div>
                <Button onClick={handleInsertImage}
                    disabled={!selectedMedia}
                >Insert</Button>
                
            </div>
        </div>
    )
}

export default function ImageInsert({ insertAtCursor, children }: { insertAtCursor: (prop: any) => void, children: any }) {
    const { show, hide } = useModal();
    const header = (
        <Title>Select or Upload Image</Title>
    )
    const showModal = () => {
        show(<ImageInsertModal insertAtCursor={insertAtCursor} hide={hide} />, undefined, undefined, header, 'w-full md:w-5/6 max-h-[80vh]');
    };
    return (
        <div className="p-2 py-4" onClick={showModal}>{children}</div>
    )
}