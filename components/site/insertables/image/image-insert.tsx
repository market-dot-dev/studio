'use client';

import { useState, useEffect, useCallback } from "react";
import { uploadFile, listMedia, deleteMedia } from "@/app/services/MediaService"; 
import { Button } from "@/components/ui/button";
import { Media as DBMedia } from "@prisma/client";
import { format } from 'date-fns'
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDropzone } from 'react-dropzone';
import Spinner from "@/components/ui/spinner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";

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
        className="dropzone min-h-30 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-1 border-dashed border-stone-300 bg-stone-50"
      >
        <input {...getInputProps()} />
        <strong>Files Upload</strong>
        {isUploading ? (
          <Spinner />
        ) : (
          <p className="text-sm text-stone-500">
            Drop files here or <a href="#" className="text-swamp font-medium">pick an image</a>
          </p>
        )}
      </div>
    );
};

function ImageInsertModal({ insertAtCursor, hide }: { insertAtCursor: (prop: any) => void, hide: () => void}) {

    const [mediaList, setMediaList] = useState<Media[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

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
        if(isDeleting) {
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
        if(selectedMedia?.id) {
            try {
                setIsDeleting(true);
                const deleted = await deleteMedia(selectedMedia.id);

                if(deleted) {
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
      <div className="flex flex-col w-full max-h-[90vh] overflow-y-auto">
        <div className="border-b border-t">
          {/* Upload Section */}
          <div className="w-full p-2">
            <StyledDropzone
              onFileAccepted={handleFileUpload}
              isUploading={isUploading}
            />
          </div>

          {/* Gallery Grid */}
          <div className="w-full p-2">
            <h3 className="font-medium text-sm mb-2">Select an image</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 max-h-[25vh] overflow-y-auto">
              {isLoading && <Spinner />}
              {mediaList.map((media) => (
                <div
                  key={media.id}
                  className={`aspect-square border rounded overflow-hidden cursor-pointer ${
                    selectedMedia?.id === media.id
                      ? "ring-2 ring-swamp ring-offset-2"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => handleSelectMedia(media)}
                >
                  <img
                    src={media.url}
                    className="h-full w-full object-cover"
                    alt=""
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form Fields - Only shown when an image is selected */}
        {selectedMedia && (
          <div className="border-b p-2">
            <div className="flex items-start justify-between mb-2">
              <p className="text-sm text-stone-500">
                {selectedMedia.createdAt
                  ? format(new Date(selectedMedia.createdAt), "PPP")
                  : "Recently uploaded"}
              </p>
              
              <Button
                size="sm"
                variant="destructive"
                loading={isDeleting}
                loadingText="Deleting"
                onClick={deleteSelected}
              >
                Delete
              </Button>
            </div>
            
            {/* Settings for the image */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="col-span-1 sm:col-span-2 mb-2">
                <Label htmlFor="alt-text" className="mb-2">Alt Text</Label>
                <Input
                  type="text"
                  id="alt-text"
                  name="alt-text"
                  value={alt}
                  onChange={(e) => setAlt(e.target.value)}
                  placeholder="Describe this image"
                />
              </div>
              
              <div className="mb-2">
                <Label htmlFor="width" className="mb-2">Width (px)</Label>
                <Input
                  id="width"
                  name="width"
                  type="number"
                  value={width}
                  min={1}
                  onChange={(e) => setWidth(e.target.value)}
                  placeholder="Width"
                />
              </div>
              
              <div className="mb-2">
                <Label htmlFor="height" className="mb-2">Height (px)</Label>
                <Input
                  id="height"
                  name="height"
                  type="number"
                  value={height}
                  min={1}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="Height"
                />
              </div>
              
            </div>
          </div>
        )}

        {/* Insert Button - Fixed at the bottom */}
        <div className="sticky bottom-0 border-t p-2 bg-white mt-auto">
          <Button 
            onClick={handleInsertImage} 
            disabled={!selectedMedia} 
            className="w-full"
          >
            {selectedMedia ? "Insert Image" : "Select an image first"}
          </Button>
        </div>
      </div>
    );
}

export default function ImageInsert({ insertAtCursor, children }: { insertAtCursor: (prop: any) => void, children: any }) {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
        <>
            <div className="p-2 py-4" onClick={() => setIsOpen(true)}>{children}</div>
            
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-h-[90vh] overflow-hidden">
                    <DialogHeader>
                        <DialogTitle>Select or Upload Image</DialogTitle>
                    </DialogHeader>
                    <ImageInsertModal 
                        insertAtCursor={insertAtCursor} 
                        hide={() => setIsOpen(false)} 
                    />
                </DialogContent>
            </Dialog>
        </>
    );
}