'use client';
import { useModal } from "@/components/modal/provider";
import { uploadFile, listMedia, deleteMedia } from "@/app/services/MediaService"; import { useState, useEffect, useCallback } from "react";
import { Media as DBMedia } from "@prisma/client";
import { Button, Flex,  NumberInput, Title, TextInput, Text } from "@tremor/react";
import { format } from 'date-fns'
import { X } from 'lucide-react';

type Media = Partial<DBMedia>;

function ImageInsertModal({ insertAtCursor, hide }: { insertAtCursor: (prop: any) => void, hide: () => void}) {

    const [mediaList, setMediaList] = useState<Media[]>([]);
    const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [isFileSelected, setIsFileSelected] = useState(false);

    const [alt, setAlt] = useState<string>('');
    const [width, setWidth] = useState<string>('');
    const [height, setHeight] = useState<string>('');

    useEffect(() => {
        async function fetchMedia() {
            const media = await listMedia() as Media[];
            setMediaList(media);
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
                    handleSelectMedia(newMedia);
                }


            } catch (error) {
                console.error(error);
            } finally {
                setIsUploading(false);
            }
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
        <Flex flexDirection="col" className="w-4/5 bg-white border">
            <Flex className="h-12 p-4 border-b">
                <div className="grow">
                    <Title>Select or Upload Image</Title>
                </div>
                <div className="py-4">
                    <Button onClick={hide} icon={X} variant="light" />
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
                    <Flex className="p-4 gap-12 border" justifyContent="start">
                        <Title>Upload Image</Title>
                        <form onSubmit={handleFileUpload}>
                            <input type="file" name="file" onInput={() => setIsFileSelected(true)} className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" />
                            <Button type="submit" loading={isUploading} disabled={!isFileSelected}>Upload</Button>
                        </form>
                    </Flex>
                </Flex>
                <Flex flexDirection="col" justifyContent="between" className="w-1/3 bg-slate-400 p-4 gap-6">
                    <Flex flexDirection="col" className="grow gap-4" justifyContent="start">
                    {selectedMedia && (
                        <>
                            <Title>Selected Image</Title>
                            <Flex className="gap-4">
                                <div style={{ width: '137px', height: '137px', flexBasis: '50%' }} >
                                    <img src={selectedMedia.url} className="object-cover w-full h-full" alt="Thumbnail" />
                                </div>
                                <Flex flexDirection="col" className="gap-4 basis-1/2" alignItems="start">
                                    <Text className="color-black text-wrap">Uploaded:<br /> {selectedMedia.createdAt ? format(new Date(selectedMedia.createdAt), 'PPP') : null}</Text>
                                    <Button color="red" size="xs" loading={isDeleting} disabled={isDeleting} onClick={deleteSelected}>Delete Permanently</Button>
                                </Flex>
                            </Flex>
                            <Flex flexDirection="col" className="gap-2">
                                <Flex className="gap-2" flexDirection="col">
                                    <label>Alt Text</label>
                                    <TextInput
                                        type="text"
                                        value={alt}
                                        onChange={(e) => setAlt(e.target.value)}
                                        placeholder="Alt Text"
                                    />
                                </Flex>
                                
                                <Flex className="gap-2" flexDirection="col">
                                    <label>Width (px)</label>
                                    <NumberInput
                                        value={width}
                                        min={1}
                                        onChange={(e) => setWidth(e.target.value)}
                                        placeholder="Width"
                                    />
                                </Flex>
                                <Flex className="gap-2" flexDirection="col">
                                    <label>Height (px)</label>
                                    <NumberInput
                                        value={height}
                                        min={1}
                                        onChange={(e) => setHeight(e.target.value)}
                                        placeholder="Height"
                                    />
                                </Flex>
                                
                            </Flex>
                        </>
                    )}
                    </Flex>
                    <Button onClick={handleInsertImage}
                        disabled={!selectedMedia}
                    >Insert</Button>
                    
                </Flex>
            </Flex>
        </Flex>
    )
}

export default function ImageInsert({ insertAtCursor, children }: { insertAtCursor: (prop: any) => void, children: any }) {
    const { show, hide } = useModal();
    const showModal = () => {
        show(<ImageInsertModal insertAtCursor={insertAtCursor} hide={hide} />);
    };
    return (
        <div className="p-2 py-4" onClick={showModal}>{children}</div>
    )
}