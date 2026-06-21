"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardFooter, Button, Chip } from "@heroui/react";
import { MdDirectionsBus, MdTrain, MdFlight } from "react-icons/md";
import { GiSpeedBoat } from "react-icons/gi";
import { FaTag, FaMapMarkerAlt, FaBoxes } from "react-icons/fa";

// Verified working Pexels image URLs per transport type
const FALLBACK_IMAGES = {
  Bus:    "https://images.pexels.com/photos/1178448/pexels-photo-1178448.jpeg?auto=compress&cs=tinysrgb&w=800",
  Train:  "https://images.pexels.com/photos/1805053/pexels-photo-1805053.jpeg?auto=compress&cs=tinysrgb&w=800",
  Launch: "https://images.pexels.com/photos/1430676/pexels-photo-1430676.jpeg?auto=compress&cs=tinysrgb&w=800",
  Plane:  "https://images.pexels.com/photos/358319/pexels-photo-358319.jpeg?auto=compress&cs=tinysrgb&w=800",
};

const transportIcons = {
  Bus:    <MdDirectionsBus className="text-green-500" size={16} />,
  Train:  <MdTrain className="text-blue-500" size={16} />,
  Launch: <GiSpeedBoat className="text-cyan-500" size={16} />,
  Plane:  <MdFlight className="text-purple-500" size={16} />,
};

const transportColors = {
  Bus: "success",
  Train: "primary",
  Launch: "secondary",
  Plane: "warning",
};

export default function TicketCard({ ticket }) {
  const router = useRouter();
  const [imgSrc, setImgSrc] = useState(null);
  const {
    _id,
    title,
    image,
    price,
    quantity,
    transportType,
    perks = [],
    from,
    to,
    departureDateTime,
  } = ticket;

  return (
    <Card
      className="card-hover h-full border border-default-100 dark:border-default-50 shadow-sm"
      isPressable={false}
    >
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden rounded-t-xl bg-gradient-to-br from-brand-700 to-purple-900">
        <img
          src={imgSrc || image || FALLBACK_IMAGES[transportType] || FALLBACK_IMAGES.Bus}
          alt={title}
          onError={() => setImgSrc(FALLBACK_IMAGES[transportType] || FALLBACK_IMAGES.Bus)}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute top-2 left-2">
          <Chip
            startContent={transportIcons[transportType]}
            color={transportColors[transportType] || "default"}
            size="sm"
            variant="flat"
            className="font-semibold"
          >
            {transportType}
          </Chip>
        </div>
      </div>

      <CardBody className="px-4 pt-4 pb-2 flex flex-col gap-2">
        <h3 className="font-bold text-base line-clamp-2 leading-snug">{title}</h3>

        {from && to && (
          <p className="flex items-center gap-1 text-sm text-default-500">
            <FaMapMarkerAlt className="text-brand-400 shrink-0" size={12} />
            <span className="truncate">
              {from} → {to}
            </span>
          </p>
        )}

        <div className="flex items-center justify-between mt-1">
          <span className="flex items-center gap-1 text-brand-500 font-bold text-lg">
            <FaTag size={12} />৳{price?.toLocaleString()}
            <span className="text-xs font-normal text-default-400">/seat</span>
          </span>
          <span className="flex items-center gap-1 text-xs text-default-500">
            <FaBoxes size={12} />
            {quantity} left
          </span>
        </div>

        {perks.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {perks.slice(0, 3).map((p) => (
              <Chip key={p} size="sm" variant="flat" color="default" className="text-xs">
                {p}
              </Chip>
            ))}
            {perks.length > 3 && (
              <Chip size="sm" variant="flat" color="default" className="text-xs">
                +{perks.length - 3}
              </Chip>
            )}
          </div>
        )}
      </CardBody>

      <CardFooter className="px-4 pb-4 pt-2">
        <Button
          fullWidth
          size="sm"
          className="bg-gradient-to-r from-brand-500 to-purple-600 text-white font-semibold"
          onPress={() => router.push(`/tickets/${_id}`)}
        >
          See Details
        </Button>
      </CardFooter>
    </Card>
  );
}
