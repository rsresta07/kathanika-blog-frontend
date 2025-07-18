import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { TextInput, Group, Loader, Title } from "@mantine/core";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ApiGetMe, ApiUpdateMe } from "@/api/user";
import showNotify from "@/utils/notify";
import CommonButton from "@/components/common/CommonButton";

// Validation schema
const schema = z.object({
  fullName: z.string().min(2, "Name too short"),
  username: z.string().min(2, "Username too short"),
  email: z.string().email("Invalid email"),
  position: z.string().min(2, "Position too short"),
});

export type FormValues = z.infer<typeof schema>;

const defaultValues: FormValues = {
  fullName: "",
  username: "",
  email: "",
  position: "",
};

const EditProfile = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  // Fetch current user data on mount
  useEffect(() => {
    (async () => {
      try {
        const { data } = await ApiGetMe();
        form.reset({
          fullName: data.fullName ?? "",
          username: data.username ?? "",
          email: data.email ?? "",
          position: data.position ?? "",
        });
      } catch (error: any) {
        showNotify(
          "error",
          error?.response?.data?.message || "Failed to fetch profile"
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Handle submit
  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      await ApiUpdateMe(values);
      showNotify("success", "Profile updated");
      const newData = await ApiGetMe();
      console.log(newData);
      // Replace with the correct username once returned from API
      router.push(`/user/${newData?.data?.username}`);
    } catch (error: any) {
      showNotify("error", error?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  // Loading indicator while fetching
  if (loading) {
    return (
      <Group mt="xl">
        <Loader />
      </Group>
    );
  }

  // Render form
  return (
    <section className="bg-light-bg pt-12 p-[12rem] pb-[15rem]">
      <Title order={3} mb="md">
        Edit Profile
      </Title>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-light-bg flex flex-col gap-4"
      >
        <TextInput
          label="Full Name"
          placeholder="John Doe"
          {...form.register("fullName")}
          error={form.formState.errors.fullName?.message}
        />

        <TextInput
          label="Username"
          placeholder="Edit your username"
          {...form.register("username")}
          error={form.formState.errors.username?.message}
        />

        <TextInput
          label="Expertise"
          placeholder="Web Developer"
          {...form.register("position")}
          error={form.formState.errors.position?.message}
        />

        <TextInput
          label="Email"
          placeholder="Email"
          {...form.register("email")}
          error={form.formState.errors.email?.message}
        />

        <div className="flex gap-4">
          <CommonButton
            label="Cancel"
            onClick={() => router.back()}
            variant="light"
          />
          <CommonButton label="Save Changes" type="submit" variant="light" />
        </div>
      </form>
    </section>
  );
};

export default EditProfile;
