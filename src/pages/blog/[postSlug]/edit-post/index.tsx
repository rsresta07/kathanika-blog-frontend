import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useForm, Controller } from "react-hook-form";
import {
  TextInput,
  Button,
  Loader,
  MultiSelect,
  Stack,
  Group,
  Text,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { APIGetPostDetails, ApiUpdatePost } from "@/api/blog";
import { ApiGetTag } from "@/api/tag";
import CustomSunEditor from "@/components/common/CommonSunEditor";
import CommonImageUpload from "@/components/common/CommonImageUpload";

type TagOption = { value: string; label: string };
type FormValues = {
  title: string;
  description: string;
  image: File | null;
  tagIds: string[];
};

const EditPost = () => {
  const router = useRouter();
  const slug = router?.query?.postSlug as string | undefined;

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { title: "", description: "", image: null, tagIds: [] },
  });

  const [tagOptions, setTagOptions] = useState<TagOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [postId, setPostId] = useState<string | null>(null);
  const [authorSlug, setAuthorSlug] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

  /* ─ fetch data ─ */
  useEffect(() => {
    if (!slug) return;
    (async () => {
      try {
        const { data: post } = await APIGetPostDetails(slug);
        const { data: tags } = await ApiGetTag();

        setTagOptions(
          tags.map((t: any) => ({ value: t?.id, label: t?.title }))
        );

        setPostId(post?.id);
        setAuthorSlug(post?.user?.username);
        setExistingImageUrl(post?.image);
        setCurrentImageUrl(post?.image);

        reset({
          title: post?.title,
          description: post?.content,
          tagIds: post?.tags?.map((t: any) => t.id),
        });
      } catch (err) {
        console.error(err);
        showNotification({ color: "red", message: "Failed to load post." });
      } finally {
        setLoading(false);
      }
    })();
  }, [slug, reset]);

  /* ─ submit ─ */
  const onSubmit = async (data: FormValues) => {
    if (!postId) return;

    try {
      const payload = {
        title: data.title,
        description: data.description,
        tagIds: data.tagIds,
        image: currentImageUrl || existingImageUrl, // Use current image URL or keep existing
      };

      await ApiUpdatePost(postId, payload);
      showNotification({
        color: "green",
        message: "Post updated successfully!",
      });

      // Navigate back to the user's profile using the stored authorSlug
      if (authorSlug) {
        router.push(`/user/${authorSlug}`);
      } else {
        router.push(`/blog/${slug}`);
        console.warn(
          "Author slug not found, navigating to post details instead of user profile."
        );
      }
    } catch (err) {
      console.error(err);
      showNotification({ color: "red", message: "Update failed" });
    }
  };

  const handleImageChange = (imageUrl: string | null) => {
    setCurrentImageUrl(imageUrl);
    // Update the form value
    setValue("image", imageUrl as any);
  };

  if (loading)
    return <Loader style={{ margin: "4rem auto", display: "block" }} />;

  /* ─ UI ─ */
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Post</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mb-12">
        <Stack>
          <Controller
            name="title"
            control={control}
            rules={{ required: "Title is required" }}
            render={({ field }) => (
              <TextInput
                label="Title"
                withAsterisk
                {...field}
                error={errors.title?.message}
              />
            )}
          />

          <label className="text-sm font-medium">Description</label>
          <Controller
            name="description"
            control={control}
            rules={{ required: "Description is required" }}
            render={({ field }) => (
              <CustomSunEditor
                value={field.value}
                onChange={field.onChange}
                error={errors.description?.message}
                // features={["image", "video"]}
              />
            )}
          />
          {errors.description && (
            <Text c="red" size="xs">
              {errors.description.message}
            </Text>
          )}

          {/* Image upload with cropping */}
          <CommonImageUpload
            control={control}
            name="image"
            label="Featured Image"
            errors={errors}
            existingImageUrl={existingImageUrl}
            onImageChange={handleImageChange}
          />

          <Controller
            name="tagIds"
            control={control}
            rules={{ required: "At least one tag is required" }}
            render={({ field }) => (
              <MultiSelect
                label="Tags"
                data={tagOptions}
                searchable
                withAsterisk
                {...field}
                error={errors.tagIds?.message}
              />
            )}
          />

          <Group>
            <Button type="submit">Update Post</Button>
          </Group>
        </Stack>
      </form>
    </div>
  );
};

export default EditPost;
