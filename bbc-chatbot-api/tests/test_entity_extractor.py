"""Tests for entity extraction V1 — regex-based."""

import pytest
from app.pipeline.entity_extractor import extract_entities, extract_kb_keywords


class TestEmailExtraction:
    def test_simple_email(self):
        e = extract_entities("my email is john@example.com")
        assert e.email == "john@example.com"

    def test_email_in_sentence(self):
        e = extract_entities("send quote to sarah.miller@gmail.com thanks")
        assert e.email == "sarah.miller@gmail.com"

    def test_no_email(self):
        e = extract_entities("I want to fly to London")
        assert e.email is None

    def test_corporate_email(self):
        e = extract_entities("contact me at mike.chen@corp.com")
        assert e.email == "mike.chen@corp.com"


class TestPhoneExtraction:
    def test_us_format_dashes(self):
        e = extract_entities("call me at 212-555-0187")
        assert e.phone is not None
        assert "212" in e.phone

    def test_us_format_plus(self):
        e = extract_entities("phone +1-310-555-0293")
        assert e.phone is not None

    def test_no_phone(self):
        e = extract_entities("I need a flight to Paris")
        assert e.phone is None


class TestAirportCodes:
    def test_two_codes(self):
        e = extract_entities("I need JFK to LHR flights")
        assert e.origin_code == "JFK"
        assert e.destination_code == "LHR"

    def test_three_codes_takes_first_two(self):
        e = extract_entities("flying JFK to LHR via CDG")
        assert e.origin_code == "JFK"
        assert e.destination_code == "LHR"

    def test_single_code(self):
        e = extract_entities("I want to go to DXB")
        assert e.destination_code == "DXB"


class TestCityNames:
    def test_new_york_to_london(self):
        e = extract_entities("from New York to London")
        assert e.origin_code == "JFK"
        assert e.destination_code == "LHR"

    def test_miami_to_paris(self):
        e = extract_entities("from Miami to Paris please")
        assert e.origin_code == "MIA"
        assert e.destination_code == "CDG"

    def test_unknown_city(self):
        e = extract_entities("from Timbuktu to Mars")
        assert e.origin_code is None


class TestNameExtraction:
    def test_my_name_is(self):
        e = extract_entities("My name is John Thompson")
        assert e.name == "John Thompson"

    def test_im(self):
        e = extract_entities("Hi, I'm Sarah")
        assert e.name == "Sarah"

    def test_no_name(self):
        e = extract_entities("I want a flight")
        assert e.name is None


class TestPassengers:
    def test_explicit(self):
        e = extract_entities("2 passengers business class")
        assert e.passengers == 2

    def test_just_me(self):
        e = extract_entities("just me flying business")
        assert e.passengers == 1

    def test_two_of_us(self):
        e = extract_entities("two of us going to Rome")
        assert e.passengers == 2


class TestCabinClass:
    def test_business(self):
        e = extract_entities("I want business class to London")
        assert e.cabin_class == "business"

    def test_first(self):
        e = extract_entities("first class JFK to DXB")
        assert e.cabin_class == "first"


class TestCombined:
    def test_full_message(self):
        e = extract_entities(
            "Hi, I'm John Thompson. I need business class flights "
            "from New York to London for 2 passengers. "
            "Email: john@example.com, phone +1-212-555-0187"
        )
        assert e.name == "John Thompson"
        assert e.email == "john@example.com"
        assert e.phone is not None
        assert e.origin_code == "JFK"
        assert e.destination_code == "LHR"
        assert e.passengers == 2
        assert e.cabin_class == "business"

    def test_minimal_message(self):
        e = extract_entities("hello")
        assert e.email is None
        assert e.phone is None
        assert e.name is None
        assert e.origin_code is None


class TestKBKeywords:
    def test_removes_stopwords(self):
        kw = extract_kb_keywords("I want to fly from New York to London")
        assert "want" not in kw
        assert "from" not in kw

    def test_keeps_meaningful(self):
        kw = extract_kb_keywords("business class baggage allowance London")
        assert "baggage" in kw or "allowance" in kw
        assert "london" in kw

    def test_airport_codes_boosted(self):
        kw = extract_kb_keywords("flights from JFK to LHR nonstop")
        assert kw[0] == "jfk" or kw[1] == "lhr"
