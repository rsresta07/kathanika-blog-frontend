import HeroLayout from "@/layouts/HeroLayout";

const AboutUs = () => {
  return (
    <main className="container mx-auto">
      <h2 className="text-2xl font-bold text-dark-font mb-4">About us</h2>
    </main>
  );
};

export default AboutUs;
AboutUs.getLayout = (page: any) => <HeroLayout>{page}</HeroLayout>;
