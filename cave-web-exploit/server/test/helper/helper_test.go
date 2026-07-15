package helper

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/zams-putra/my-boot2root/cave/cave/server/internal/helper"
)

func TestWriteJSON_StatusAndContentType(t *testing.T) {
	rr := httptest.NewRecorder()

	helper.WriteJSON(rr, http.StatusOK, map[string]string{"messages": "ok"})

	if rr.Code != http.StatusOK {
		t.Errorf("expected 200, got %d", rr.Code)
	}

	ct := rr.Header().Get("Content-Type")
	if ct != "application/json" {
		t.Errorf("expected Content-Type application/json, got %s", ct)
	}
}

func TestWriteJSON_BodyIsValidJSON(t *testing.T) {
	rr := httptest.NewRecorder()

	type payload struct {
		Messages string `json:"messages"`
		Token    string `json:"token"`
	}

	helper.WriteJSON(rr, http.StatusCreated, payload{
		Messages: "berhasil",
		Token:    "abc123",
	})

	var result payload
	err := json.NewDecoder(rr.Body).Decode(&result)
	if err != nil {
		t.Fatalf("response bukan valid JSON: %v", err)
	}

	if result.Messages != "berhasil" {
		t.Errorf("expected messages='berhasil', got '%s'", result.Messages)
	}
	if result.Token != "abc123" {
		t.Errorf("expected token='abc123', got '%s'", result.Token)
	}
}

func TestWriteJSON_StatusCodes(t *testing.T) {
	cases := []struct {
		name       string
		statusCode int
	}{
		{"OK", http.StatusOK},
		{"Created", http.StatusCreated},
		{"BadRequest", http.StatusBadRequest},
		{"Unauthorized", http.StatusUnauthorized},
		{"Forbidden", http.StatusForbidden},
		{"NotFound", http.StatusNotFound},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			rr := httptest.NewRecorder()
			helper.WriteJSON(rr, tc.statusCode, map[string]string{"test": "ok"})
			if rr.Code != tc.statusCode {
				t.Errorf("expected %d, got %d", tc.statusCode, rr.Code)
			}
		})
	}
}

func TestWriteJSON_NilData(t *testing.T) {
	rr := httptest.NewRecorder()

	// nil harusnya encode jadi "null" tanpa panic
	helper.WriteJSON(rr, http.StatusOK, nil)

	if rr.Code != http.StatusOK {
		t.Errorf("expected 200, got %d", rr.Code)
	}
}
