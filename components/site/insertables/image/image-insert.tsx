'use client';
import { useModal } from "@/components/modal/provider";
import { uploadFile, listMedia } from "@/app/services/MediaService"; import { useState, useEffect } from "react";
import { Media as DBMedia } from "@prisma/client";
import { Button, Flex, Grid, Subtitle, Title } from "@tremor/react";


type Media = Partial<DBMedia>;

function ImageInsertModal({ insertAtCursor, hide }: { insertAtCursor: (prop: any) => void, hide: () => void}) {

    const [mediaList, setMediaList] = useState<Media[]>([]);
    const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);

    useEffect(() => {
        async function fetchMedia() {
            const media = await listMedia() as Media[];
            setMediaList(media);
        }

        fetchMedia();

    }, []);


    const handleSelectMedia = (media : Media) => {
        
        setSelectedMedia(media);
        
    };

    const handleInsertImage = () => {
        if (selectedMedia) {
            insertAtCursor(`<img src="${selectedMedia.url}" />`);
            hide(); 
        }
    };

    const handleFileUpload = async (e: any) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        // if file is selected
        const file = formData.get("file");
        
        if (file) {    
            
            setIsUploading(true);
            try {
                const newMedia = await uploadFile(formData);
                
                if (newMedia) {
                    setMediaList([...mediaList, newMedia]);
                }

            } catch (error) {
                console.error(error);
            } finally {
                setIsUploading(false);
            }
        }
    };

    return (
        <Flex flexDirection="col" className="w-4/5 h-4/5 bg-white">
            <Flex className="h-12 p-4 border-b">
                <div className="grow">
                    <Title>Select or Upload Image</Title>
                </div>
                <div>
                    <Button onClick={hide}>Close</Button>
                </div>
            </Flex>
            <Flex className="grow" alignItems="stretch">
                <Flex flexDirection="col" alignItems="stretch">
                    <Flex justifyContent="start" alignItems="start" className="gap-4 grow p-4 flex-wrap" >
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
                    </Flex>
                    <div className="p-4">
                        <form onSubmit={handleFileUpload}>
                            <input type="file" name="file" className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" />
                            <Button type="submit" loading={isUploading}>Upload</Button>
                        </form>
                    </div>
                </Flex>
                <Flex flexDirection="col" className="w-1/3 bg-slate-400 p-4">
                    <Subtitle>Media Details</Subtitle>
                    <Button onClick={handleInsertImage}
                        disabled={!selectedMedia}
                    >Insert</Button>
                    
                </Flex>
            </Flex>
        </Flex>
    )
}

export default function ImageInsert({ insertAtCursor }: { insertAtCursor: (prop: any) => void }) {
    const { show, hide } = useModal();
    const showModal = () => {
        show(<ImageInsertModal insertAtCursor={insertAtCursor} hide={hide} />);
    };
    return (
        <div onClick={showModal}>Image</div>
    )
}