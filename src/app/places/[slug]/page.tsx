import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  Ticket,
  Phone,
  Navigation,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { getPlaceBySlug } from "@/lib/services/places";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AddToTripButton } from "@/components/trips/AddToTripButton";
import { EmergencyContacts } from "@/components/safety/EmergencyContacts";
import { FavoriteButton } from "@/components/places/FavoriteButton";

interface PlaceDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: PlaceDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const place = await getPlaceBySlug(slug);

  if (!place) {
    return {
      title: "ไม่พบสถานที่ท่องเที่ยว | Nakhon Nayok Trip",
    };
  }

  return {
    title: `${place.name} - เที่ยวนครนายก | Nakhon Nayok Trip`,
    description: place.highlight || place.description.slice(0, 150),
    openGraph: {
      title: `${place.name} | Nakhon Nayok Trip`,
      description: place.highlight || place.description.slice(0, 150),
      images: [{ url: place.cover_image }],
    },
  };
}

export default async function PlaceDetailPage({ params }: PlaceDetailPageProps) {
  const { slug } = await params;
  const place = await getPlaceBySlug(slug);

  if (!place) {
    notFound();
  }

  const weatherSummary = place.weather_pattern ||
    (place.category?.slug === "waterfalls"
      ? "อากาศเย็นและชื้น เหมาะสำหรับชมธรรมชาติช่วงเช้า"
      : place.category?.slug === "cafes"
        ? "อากาศเย็นตอนเช้า - เย็น เหมาะสำหรับนั่งคาเฟ่"
        : place.category?.slug === "activities"
          ? "อากาศดีเหมาะกับกีฬากลางแจ้งและล่องแก่ง"
          : "อากาศทั่วไป เหมาะสำหรับเที่ยวเช้า-บ่าย");

  const bestVisit = place.best_time_to_visit || "ช่วงเช้า 08:00 - 11:00 น. เหมาะสำหรับบรรยากาศที่สวยและอากาศไม่ร้อน";
  const mapEmbedUrl = place.latitude && place.longitude
    ? `https://www.google.com/maps?q=${place.latitude},${place.longitude}&z=14&output=embed`
    : undefined;
  const nearbyHighlights = place.nearby_highlights?.length ? place.nearby_highlights : ["ธรรมชาติ", "ถ่ายรูป", "พักผ่อน"];
  const vibeTags = place.vibes?.length ? place.vibes : ["ธรรมชาติ", "ชิล", "ถ่ายรูป"];
  const nearbyRecommendations = place.nearby_recommendations?.length
    ? place.nearby_recommendations
    : [
        { name: "ร้านอาหารใกล้เคียง", kind: "Food", distance: "5-10 นาที", note: "เหมาะสำหรับพักทานอาหารหลังเที่ยว" },
        { name: "จุดถ่ายรูปต่อ", kind: "Photo", distance: "3-8 นาที", note: "มุมสวยและแสงเย็นเหมาะสำหรับถ่าย" },
        { name: "สถานที่ต่อไป", kind: "Next stop", distance: "10-20 นาที", note: "ผสานทริปให้เดินทางต่อได้อย่างมีประสิทธิภาพ" },
      ];

  return (
    <div className="space-y-5 pb-8 pt-2">
      <div className="flex items-center justify-between">
        <Link
          href="/places"
          className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-700 shadow-xs border border-slate-100 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>

        <div className="flex items-center gap-2">
          <FavoriteButton place={place} />
          <AddToTripButton place={place} />
        </div>
      </div>

      <div className="relative h-64 w-full overflow-hidden rounded-3xl bg-slate-100 shadow-md sm:h-80">
        <Image
          src={place.cover_image}
          alt={place.name}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 800px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <div className="space-y-1">
            {place.category && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-slate-800 backdrop-blur-md">
                <span>{place.category.icon}</span>
                <span>{place.category.name}</span>
              </span>
            )}
            <h1 className="text-xl font-black text-white sm:text-2xl drop-shadow-md">
              {place.name}
            </h1>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {vibeTags.map((tag) => (
                <span key={tag} className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold text-white/90 backdrop-blur-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1 rounded-2xl bg-slate-900/80 px-3 py-1.5 text-xs font-extrabold text-amber-300 backdrop-blur-md shadow-md shrink-0">
              <Star className="h-4 w-4 fill-amber-300 text-amber-300" />
              <span>{place.rating.toFixed(1)}</span>
              <span className="text-[10px] font-normal text-slate-400">
                ({place.review_count})
              </span>
            </div>
            {place.crowd_level && (
              <span className="rounded-full bg-emerald-500/90 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
                {place.crowd_level}
              </span>
            )}
          </div>
        </div>
      </div>

      {place.highlight && (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 text-xs text-emerald-900 shadow-xs">
          <Sparkles className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-emerald-800">ไฮไลท์ประจำสถานที่</span>
            <p className="leading-relaxed text-emerald-950/80">{place.highlight}</p>
          </div>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <Card className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Clock className="h-4 w-4 text-emerald-600" />
            <span>Weather & best visit</span>
          </div>
          <div className="rounded-2xl bg-emerald-50 p-3 text-xs text-emerald-900">
            <div className="font-bold">อากาศแนะนำ</div>
            <p className="mt-1 leading-relaxed">{weatherSummary}</p>
          </div>
          <div className="rounded-2xl bg-amber-50 p-3 text-xs text-amber-900">
            <div className="font-bold">ช่วงเวลาที่เหมาะ</div>
            <p className="mt-1 leading-relaxed">{bestVisit}</p>
          </div>
          {place.crowd_level && (
            <div className="rounded-2xl bg-slate-100 p-3 text-xs text-slate-700">
              <div className="font-bold">ความคึกคัก</div>
              <p className="mt-1 leading-relaxed">{place.crowd_level} — เหมาะกับการไปในช่วง {place.crowd_level === "เงียบ" ? "เช้า" : "เช้า-บ่าย"}</p>
            </div>
          )}
        </Card>

        <Card className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <MapPin className="h-4 w-4 text-emerald-600" />
            <span>Nearby highlights</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {nearbyHighlights.map((item) => (
              <span key={item} className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-800">
                {item}
              </span>
            ))}
          </div>
          <div className="rounded-2xl bg-sky-50 p-3 text-xs text-sky-900">
            <div className="font-bold">แนะนำสำหรับ</div>
            <p className="mt-1">พักผ่อน · ถ่ายรูป · ชมธรรมชาติ · คว้าโมเมนต์เช้า/เย็น</p>
          </div>
        </Card>
      </div>

      <Card className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
          <Sparkles className="h-4 w-4 text-emerald-600" />
          <span>Nearby Recommendations</span>
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          {nearbyRecommendations.map((item) => (
            <div key={`${item.name}-${item.kind}`} className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-slate-500">{item.kind}</span>
                <span className="text-[10px] text-slate-400">{item.distance}</span>
              </div>
              <div className="mt-2 text-sm font-bold text-slate-800">{item.name}</div>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-600">{item.note}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="text-base font-bold text-slate-900 mb-2">เกี่ยวกับสถานที่</h2>
        <p className="text-xs leading-relaxed text-slate-600 sm:text-sm whitespace-pre-line">
          {place.description}
        </p>
      </Card>

      <Card>
        <h2 className="text-base font-bold text-slate-900 mb-3">ข้อมูลที่เป็นประโยชน์</h2>
        <div className="space-y-3.5 text-xs sm:text-sm">
          <div className="flex items-start gap-3 border-b border-slate-50 pb-3">
            <Clock className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
            <div className="flex-1">
              <span className="font-medium text-slate-400 block text-[11px]">เวลาเปิด - ปิด</span>
              <span className="font-semibold text-slate-800">{place.opening_hours || "เปิดทุกวัน"}</span>
            </div>
          </div>

          <div className="flex items-start gap-3 border-b border-slate-50 pb-3">
            <Ticket className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
            <div className="flex-1">
              <span className="font-medium text-slate-400 block text-[11px]">ค่าเข้าชม / ค่าบริการ</span>
              <span className="font-semibold text-slate-800">{place.fee || "ไม่มีค่าเข้าชม"}</span>
            </div>
          </div>

          {place.phone && (
            <div className="flex items-start gap-3 border-b border-slate-50 pb-3">
              <Phone className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
              <div className="flex-1">
                <span className="font-medium text-slate-400 block text-[11px]">เบอร์โทรศัพท์</span>
                <a href={`tel:${place.phone}`} className="font-semibold text-emerald-600 hover:underline">
                  {place.phone}
                </a>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <MapPin className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
            <div className="flex-1">
              <span className="font-medium text-slate-400 block text-[11px]">ที่อยู่ / อำเภอ</span>
              <span className="font-semibold text-slate-800">
                {place.address ? `${place.address}, ` : ""}อ.{place.district || "เมืองนครนายก"} จ.นครนายก
              </span>
            </div>
          </div>
        </div>
      </Card>

      {mapEmbedUrl && (
        <Card className="overflow-hidden p-0">
          <div className="border-b border-slate-100 px-4 py-3">
            <h2 className="text-base font-bold text-slate-900">แผนที่ตำแหน่งจริง</h2>
          </div>
          <div className="h-64 w-full">
            <iframe
              title={`${place.name} location map`}
              src={mapEmbedUrl}
              className="h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Card>
      )}

      {place.google_maps_url && (
        <div className="space-y-2">
          <a
            href={place.google_maps_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Button className="w-full h-12 text-sm shadow-md">
              <Navigation className="mr-2 h-4 w-4" />
              นำทางด้วย Google Maps
              <ExternalLink className="ml-2 h-3.5 w-3.5" />
            </Button>
          </a>
          <p className="px-1 text-center text-[10px] text-slate-400">เปิดแผนที่เพื่อดูเส้นทางและสภาพการจราจรล่าสุด</p>
        </div>
      )}

      <EmergencyContacts compact />
    </div>
  );
}
