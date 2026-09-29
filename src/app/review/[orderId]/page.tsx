import { redirect } from 'next/navigation';

export default async function ReviewOrderRedirect({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  redirect(`/review?orderId=${orderId}`);
}
