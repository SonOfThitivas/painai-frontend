"use client"

import React, { useState } from "react";
import { Card, CardContent, Avatar, Typography, CardActions, Button, CardHeader, Stack, Box } from "@mui/material";
import EventIcon from '@mui/icons-material/CalendarMonthOutlined';
import PlaceIcon from '@mui/icons-material/FmdGood';
import { red } from '@mui/material/colors';

interface ActivityCardProps {
  title?: string;
  description?: string;
  date?: string;
  username?: string;
  place?: string;
  avatarUrl?: string;
  images?: string[];
}

export default function ActivityCard({
  title = "Default Activity",
  description = "No description available.",
  date = "Unknown date",
  username = "Anonymous",
  place = "KMUTNB",
  images = [],
  avatarUrl = "null",
}: ActivityCardProps) {

  const [showFullText, setShowFullText] = useState(false);

  // grid column layout based on number of images
  const getGridColumns = (num: number) => {
    if (num === 1) return "1fr";
    if (num === 2) return "1fr 1fr";
    if (num === 3) return "1fr 1fr";
    return "1fr 1fr"; // 4+ images → 2x2 grid
  };

  return (
    <Card sx={{ width: 700, minHeight: 345, m: 1, boxShadow: 3, borderRadius: 2 }}>
      
      <CardHeader
        avatar={
          avatarUrl ? (
            <Avatar
              src={avatarUrl}           // show image if URL exists
              sx={{ width: 60, height: 60 }}
              aria-label="user"
            />
          ) : (
            <Avatar
              sx={{ width: 60, height: 60, bgcolor: red[500] }}
              aria-label="user"
            >
              
            </Avatar>
          )
        }
        title={<Typography variant="subtitle1" fontWeight="bold">{username}</Typography>}
        subheader={
          <Stack direction="row" spacing={5}>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <EventIcon fontSize="medium" color="action" />
              <Typography variant="caption">{date}</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <PlaceIcon fontSize="medium" color="action" />
              <Typography variant="caption">{place}</Typography>
            </Stack>
          </Stack>
        }
      />

      <CardContent>
        <Typography variant="h6" fontWeight="bold">{title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {description.length <= 400 || showFullText
            ? description
            : `${description.substring(0, 400)}...`}
          {description.length > 400 && (
            <Button
              size="small"
              onClick={() => setShowFullText(!showFullText)}
              sx={{ textTransform: "none", ml: 0.5 }}
            >
              {showFullText ? "Read less" : "Read more"}
            </Button>
          )}
        </Typography>
      </CardContent>

      {images.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 1, mb: 1 }}>
          <Box
            sx={{
              display: "grid",
              gap: 0.5,
              width: "90%",
              gridTemplateColumns: getGridColumns(images.length),
            }}
          >
            {images.map((img, index) => (
              <Box
                key={index}
                component="img"
                src={img}
                alt={`activity-${index}`}
                sx={{
                  width: "100%",
                  height: 150,
                  objectFit: "cover",
                  borderRadius: 1,
                }}
              />
            ))}
          </Box>
        </Box>
      )}

    </Card>
  );
}
