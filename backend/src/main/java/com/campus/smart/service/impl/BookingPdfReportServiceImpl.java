package com.campus.smart.service.impl;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Objects;

import org.springframework.stereotype.Service;

import com.campus.smart.dto.BookingResponse;
import com.campus.smart.service.BookingPdfReportService;
import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;

@Service
public class BookingPdfReportServiceImpl implements BookingPdfReportService {

	private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ISO_LOCAL_DATE;
	private static final DateTimeFormatter TIME_FMT = DateTimeFormatter.ofPattern("HH:mm");
	private static final DateTimeFormatter GEN_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

	@Override
	public byte[] buildMyBookingsReport(List<BookingResponse> bookings, String userEmail) {
		Objects.requireNonNull(bookings, "bookings");
		String owner = userEmail != null ? userEmail : "";

		Document document = new Document(PageSize.A4, 40, 40, 40, 40);
		ByteArrayOutputStream out = new ByteArrayOutputStream();
		PdfWriter.getInstance(document, out);

		Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16);
		Font metaFont = FontFactory.getFont(FontFactory.HELVETICA, 10);
		Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9);
		Font cellFont = FontFactory.getFont(FontFactory.HELVETICA, 8);

		document.open();

		document.add(new Paragraph("Smart Campus — My bookings report", titleFont));
		document.add(new Paragraph("Generated for: " + owner, metaFont));
		document.add(new Paragraph(
				"Generated at: " + java.time.LocalDateTime.now().format(GEN_FMT),
				metaFont));
		document.add(new Paragraph(" ", metaFont));

		if (bookings.isEmpty()) {
			document.add(new Paragraph("You have no bookings to include in this report.", metaFont));
			document.close();
			return out.toByteArray();
		}

		float[] widths = { 0.9f, 1.4f, 1.1f, 1.0f, 0.9f, 1.5f };
		PdfPTable table = new PdfPTable(widths);
		table.setWidthPercentage(100);
		table.setSpacingBefore(4f);
		table.setSpacingAfter(8f);

		addHeaderCell(table, "ID", headerFont);
		addHeaderCell(table, "Resource", headerFont);
		addHeaderCell(table, "Date", headerFont);
		addHeaderCell(table, "Time", headerFont);
		addHeaderCell(table, "Status", headerFont);
		addHeaderCell(table, "Purpose", headerFont);

		for (BookingResponse b : bookings) {
			addBodyCell(table, b.getId() != null ? String.valueOf(b.getId()) : "—", cellFont);
			addBodyCell(table, nullToDash(b.getResourceName()), cellFont);
			addBodyCell(table, b.getDate() != null ? b.getDate().format(DATE_FMT) : "—", cellFont);
			String timeRange = formatTimeRange(b);
			addBodyCell(table, timeRange, cellFont);
			addBodyCell(table, b.getStatus() != null ? b.getStatus().name() : "—", cellFont);
			addBodyCell(table, truncate(nullToDash(b.getPurpose()), 120), cellFont);
		}

		document.add(table);

		Paragraph footer = new Paragraph(
				"Total bookings listed: " + bookings.size(),
				metaFont);
		footer.setSpacingBefore(8f);
		document.add(footer);

		document.close();
		return out.toByteArray();
	}

	private static void addHeaderCell(PdfPTable table, String text, Font font) {
		PdfPCell cell = new PdfPCell(new Phrase(text, font));
		cell.setHorizontalAlignment(Element.ALIGN_CENTER);
		cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
		cell.setPadding(6f);
		table.addCell(cell);
	}

	private static void addBodyCell(PdfPTable table, String text, Font font) {
		PdfPCell cell = new PdfPCell(new Phrase(text != null ? text : "", font));
		cell.setVerticalAlignment(Element.ALIGN_TOP);
		cell.setPadding(5f);
		table.addCell(cell);
	}

	private static String formatTimeRange(BookingResponse b) {
		if (b.getStartTime() == null && b.getEndTime() == null) {
			return "—";
		}
		String s = b.getStartTime() != null ? b.getStartTime().format(TIME_FMT) : "?";
		String e = b.getEndTime() != null ? b.getEndTime().format(TIME_FMT) : "?";
		return s + " – " + e;
	}

	private static String nullToDash(String s) {
		return (s == null || s.isBlank()) ? "—" : s;
	}

	private static String truncate(String s, int max) {
		if (s == null || s.length() <= max) {
			return s;
		}
		return s.substring(0, max - 1) + "…";
	}
}
