"use client";
import { useModal } from "@/components/modal/provider";
import {
  uploadFile,
  listMedia,
  deleteMedia,
} from "@/app/services/MediaService";
import { useState, useEffect, useCallback } from "react";
import { Media as DBMedia } from "@prisma/client";
import {
  Button,
  Flex,
  NumberInput,
  Title,
  TextInput,
  Text,
  Bold,
} from "@tremor/react";
import { format } from "date-fns";

import { useDropzone } from "react-dropzone";
import { Spinner } from "flowbite-react";

type Media = Partial<DBMedia>;

const StyledDropzone = ({ onFileAccepted, isUploading }: any) => {
  const onDrop = useCallback(
    (acceptedFiles: any[]) => {
      // Automatically upload the first file
      if (acceptedFiles.length > 0) {
        onFileAccepted(acceptedFiles[0]);
      }
    },
    [onFileAccepted],
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <Flex
      {...getRootProps()}
      flexDirection="col"
      className="dropzone min-h-30 cursor-pointer gap-2 rounded-md border-2 border-dashed p-4"
      justifyContent="start"
    >
      <input {...getInputProps()} />
      <Bold>Files Upload</Bold>
      {isUploading ? (
        <Spinner />
      ) : (
        <Text className="py-1">
          Drop files here or <strong>Click</strong> to select files
        </Text>
      )}
    </Flex>
  );
};

function ImageInsertModal({
  insertAtCursor,
  hide,
}: {
  insertAtCursor: (prop: any) => void;
  hide: () => void;
}) {
  const [mediaList, setMediaList] = useState<Media[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  // const [isFileSelected, setIsFileSelected] = useState(false);

  const [alt, setAlt] = useState<string>("");
  const [width, setWidth] = useState<string>("");
  const [height, setHeight] = useState<string>("");

  useEffect(() => {
    async function fetchMedia() {
      setIsLoading(true);
      const media = (await listMedia()) as Media[];
      setMediaList(media);
      setIsLoading(false);
    }

    fetchMedia();
  }, []);

  const handleSelectMedia = (media: Media) => {
    if (isDeleting) {
      return;
    }

    setSelectedMedia(media);
  };

  const handleInsertImage = useCallback(() => {
    if (selectedMedia) {
      insertAtCursor(
        `<img src="${selectedMedia.url}" ${alt ? `alt="${alt}"` : ""} ${width ? `width="${width}"` : ""} ${height ? `height="${height}"` : ""} />`,
      );
      hide();
    }
  }, [selectedMedia, insertAtCursor, hide, alt, width, height]);

  const handleFileUpload = async (file: any) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

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
    if (selectedMedia?.id) {
      try {
        setIsDeleting(true);
        const deleted = await deleteMedia(selectedMedia.id);

        if (deleted) {
          setMediaList((mediaList) =>
            mediaList.filter((media) => media.id !== selectedMedia.id),
          );
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
    <Flex className="grow" alignItems="stretch">
      <Flex flexDirection="col" alignItems="stretch">
        <Flex
          flexDirection="col"
          justifyContent="center"
          alignItems="center"
          className="w-full gap-2 p-4"
        >
          <StyledDropzone
            onFileAccepted={handleFileUpload}
            isUploading={isUploading}
          />
        </Flex>

        <Flex
          justifyContent="start"
          alignItems="start"
          className="max-h-[60vh] grow flex-wrap gap-4 overflow-auto p-4"
        >
          {isLoading && <Spinner />}
          {mediaList.map((media) => {
            const classes = `border ${selectedMedia?.id === media.id ? "border-blue-500" : "border-transparent"} cursor-pointer`;
            return (
              <div
                key={media.id}
                className={classes}
                onClick={() => handleSelectMedia(media)}
                style={{ width: "137px", height: "137px" }}
              >
                <img src={media.url} className="h-full w-full object-cover" />
              </div>
            );
          })}
        </Flex>
      </Flex>
      <Flex
        flexDirection="col"
        justifyContent="between"
        className="w-1/3 gap-6 bg-stone-100 p-4"
      >
        <Flex
          flexDirection="col"
          className="min-h-[60vh] grow gap-4"
          justifyContent="start"
        >
          {selectedMedia && (
            <>
              <Title>Selected Image</Title>
              <Flex className="gap-4">
                <div
                  style={{ width: "137px", height: "137px", flexBasis: "50%" }}
                >
                  <img
                    src={selectedMedia.url}
                    className="h-full w-full object-cover"
                    alt="Thumbnail"
                  />
                </div>
                <Flex
                  flexDirection="col"
                  className="basis-1/2 gap-4"
                  alignItems="start"
                >
                  <Text className="color-black text-wrap">
                    Uploaded:
                    <br />{" "}
                    {selectedMedia.createdAt
                      ? format(new Date(selectedMedia.createdAt), "PPP")
                      : null}
                  </Text>
                  <Button
                    color="red"
                    size="xs"
                    loading={isDeleting}
                    disabled={isDeleting}
                    onClick={deleteSelected}
                  >
                    Delete
                  </Button>
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
        <Button onClick={handleInsertImage} disabled={!selectedMedia}>
          Insert
        </Button>
      </Flex>
    </Flex>
  );
}

export default function ImageInsert({
  insertAtCursor,
  children,
}: {
  insertAtCursor: (prop: any) => void;
  children: any;
}) {
  const { show, hide } = useModal();
  const header = <Title>Select or Upload Image</Title>;
  const showModal = () => {
    show(
      <ImageInsertModal insertAtCursor={insertAtCursor} hide={hide} />,
      undefined,
      undefined,
      header,
      "w-full md:w-5/6 max-h-[80vh]",
    );
  };
  return (
    <div className="p-2 py-4" onClick={showModal}>
      {children}
    </div>
  );
}
