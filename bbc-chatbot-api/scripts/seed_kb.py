"""Seed initial knowledge base entries into Supabase."""

import asyncio
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.db.supabase import _get_client, _uid, _now

KB_SEED = [
    # ── ROUTES ────────────────────────────────────────────────
    {
        "category": "routes",
        "title": "NYC to London",
        "content": (
            "New York (JFK/EWR) to London (LHR/LGW). Airlines: British Airways, "
            "Virgin Atlantic, Delta, American, United. Duration: 7-8 hours nonstop. "
            "Business class typically $2,800-$4,500 round trip. Peak: Jun-Aug, Dec. "
            "Best fares: Feb-Apr, Oct-Nov."
        ),
    },
    {
        "category": "routes",
        "title": "LA to Tokyo",
        "content": (
            "Los Angeles (LAX) to Tokyo (NRT/HND). Airlines: ANA, Japan Airlines, "
            "Singapore, Korean Air. Duration: 11-12 hours nonstop. Business class "
            "typically $3,200-$5,800 round trip. Peak: Mar-Apr (cherry blossom), Oct. "
            "Best fares: Jan-Feb, May."
        ),
    },
    {
        "category": "routes",
        "title": "Chicago to Paris",
        "content": (
            "Chicago (ORD) to Paris (CDG). Airlines: Air France, United, American. "
            "Duration: 8-9 hours nonstop. Business class typically $2,600-$4,200 "
            "round trip. Peak: Jun-Sep. Best fares: Jan-Mar, Nov."
        ),
    },
    {
        "category": "routes",
        "title": "Miami to Dubai",
        "content": (
            "Miami (MIA) to Dubai (DXB). Airlines: Emirates (nonstop). Duration: "
            "16 hours nonstop. Business class typically $3,800-$6,500 round trip. "
            "Best fares: May-Sep (off-peak desert heat)."
        ),
    },
    {
        "category": "routes",
        "title": "SF to Singapore",
        "content": (
            "San Francisco (SFO) to Singapore (SIN). Airlines: Singapore Airlines "
            "(nonstop, 17.5h — world's longest), United. Business class typically "
            "$3,500-$6,000 round trip."
        ),
    },
    # ── SERVICES ──────────────────────────────────────────────
    {
        "category": "services",
        "title": "How BBC Works",
        "content": (
            "Buy Business Class finds discounted business and first class fares "
            "through industry connections and consolidator rates. Savings typically "
            "30-70% off published prices. We search all major airlines and routes. "
            "A specialist contacts you within 2 hours with personalized options."
        ),
    },
    {
        "category": "services",
        "title": "Payment Options",
        "content": (
            "We accept all major credit cards, wire transfer, and offer FlexPay "
            "installment plans for qualifying bookings. Full payment required "
            "before ticket issuance."
        ),
    },
    {
        "category": "services",
        "title": "Fare Guarantee",
        "content": (
            "All fares are subject to availability at time of booking. Prices shown "
            "are estimates based on recent availability. Your specialist will confirm "
            "exact pricing and availability."
        ),
    },
    # ── BOOKING ───────────────────────────────────────────────
    {
        "category": "booking",
        "title": "Booking Steps",
        "content": (
            "1. Tell us your route and dates. 2. Specialist finds best options "
            "within 2 hours. 3. Review options and select. 4. Complete payment. "
            "5. Receive e-ticket confirmation. Changes and cancellations subject "
            "to airline policies."
        ),
    },
    {
        "category": "booking",
        "title": "Change Policy",
        "content": (
            "Changes depend on airline ticket rules. Most business class tickets "
            "allow one free date change. Route changes may incur fare difference. "
            "Contact us at least 48 hours before departure for changes."
        ),
    },
    # ── POLICIES ──────────────────────────────────────────────
    {
        "category": "policies",
        "title": "Cancellation",
        "content": (
            "Cancellation policies vary by airline and fare class. Most business "
            "class tickets are refundable minus a service fee. Contact your "
            "specialist immediately for cancellations. 24-hour free cancellation "
            "available on most bookings."
        ),
    },
    {
        "category": "policies",
        "title": "Baggage",
        "content": (
            "Business class typically includes 2 checked bags (32kg/70lb each) "
            "plus carry-on and personal item. First class may include 3 checked "
            "bags. Exact allowance depends on airline and route. Contact us for "
            "specific details."
        ),
    },
    # ── FAQ ───────────────────────────────────────────────────
    {
        "category": "faq",
        "title": "Why cheaper than airlines?",
        "content": (
            "We access consolidator fares, group rates, and special agency "
            "agreements that aren't available to the public. We also monitor fare "
            "sales and routing tricks that can save 30-70% vs booking directly."
        ),
    },
    {
        "category": "faq",
        "title": "Is it safe?",
        "content": (
            "We are a licensed travel agency with IATA accreditation. Your tickets "
            "are issued directly by the airline — we are the booking agent, not the "
            "operator. Your ticket is fully valid and appears in the airline's system."
        ),
    },
    {
        "category": "faq",
        "title": "How long until I hear back?",
        "content": (
            "A specialist will contact you within 2 hours during business hours "
            "(9AM-6PM EST Mon-Fri). After-hours inquiries are handled first thing "
            "next business day."
        ),
    },
]


def seed():
    """Insert all KB entries into Supabase."""
    client = _get_client()
    now = _now()

    rows = []
    for entry in KB_SEED:
        rows.append({
            "id": _uid(),
            "category": entry["category"],
            "title": entry["title"],
            "content": entry["content"],
            "created_at": now,
            "updated_at": now,
        })

    try:
        result = client.table("kb_entries").insert(rows).execute()
        print(f"✓ Inserted {len(result.data)} KB entries")
    except Exception as e:
        print(f"✗ Seed failed: {e}")
        sys.exit(1)


if __name__ == "__main__":
    seed()
