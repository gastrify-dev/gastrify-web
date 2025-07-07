import { MinusCircleIcon } from "lucide-react";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  TypographyMuted,
  TypographyP,
} from "@/shared/components/ui/typography";
import type { Session } from "@/shared/types";

import { useActiveSessionCard } from "@/features/settings/hooks/use-active-session-card";

interface Props {
  session: Omit<Session["session"], "id">;
  isCurrentSession: boolean;
  isSessionsFetching: boolean;
}

export const ActiveSessionCard = ({
  session,
  isCurrentSession,
  isSessionsFetching,
}: Props) => {
  const { handleRevokeSession, t } = useActiveSessionCard();

  return (
    <Card className="w-fit">
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          {t("user-agent-label")}{" "}
          {isCurrentSession && <Badge>{t("current-badge")}</Badge>}
        </CardTitle>

        <CardDescription>{session.userAgent}</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-0 text-sm">
        <div className="flex items-center gap-2">
          <TypographyP>{t("ip-address-label")}</TypographyP>
          <TypographyMuted>{session.ipAddress}</TypographyMuted>
        </div>

        <div className="flex items-center gap-2">
          <TypographyP>{t("created-at-label")}</TypographyP>
          <TypographyMuted>
            {new Date(session.createdAt).toLocaleString()}
          </TypographyMuted>
        </div>

        <div className="flex items-center gap-2">
          <TypographyP>{t("updated-at-label")}</TypographyP>
          <TypographyMuted>
            {new Date(session.updatedAt).toLocaleString()}
          </TypographyMuted>
        </div>

        <div className="flex items-center gap-2">
          <TypographyP>{t("expires-at-label")}</TypographyP>
          <TypographyMuted>
            {new Date(session.expiresAt).toLocaleString()}
          </TypographyMuted>
        </div>
      </CardContent>

      {!isCurrentSession && !isSessionsFetching && (
        <CardFooter>
          <Button
            variant="destructive"
            size="sm"
            type="button"
            onClick={() => handleRevokeSession(session.token)}
          >
            <MinusCircleIcon />
            {t("revoke-button")}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
