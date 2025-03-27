import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Back from "@/public/img/back.png";

export default function BackButton() {
  const router = useRouter();

  return (
    <Image
      src={Back}
      alt="Back"
      width={40}
      height={40}
      className="cursor-pointer"
      onClick={() => router.back()}
    />
  );
}