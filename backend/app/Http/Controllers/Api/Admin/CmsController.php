<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CmsController extends Controller
{
    public function getLogos()
    {
        $logos = [
            'header_logo' => Setting::getValue('header_logo', ''),
            'header_logo_type' => Setting::getValue('header_logo_type', 'svg'),
            'footer_logo' => Setting::getValue('footer_logo', ''),
            'footer_logo_type' => Setting::getValue('footer_logo_type', 'svg'),
            'favicon' => Setting::getValue('favicon', ''),
            'favicon_type' => Setting::getValue('favicon_type', 'svg'),
            'site_name' => Setting::getValue('site_name', 'EarnClicks'),
            'site_tagline' => Setting::getValue('site_tagline', 'SOCIAL TASK & REWARDS PLATFORM'),
        ];

        return response()->json(['logos' => $logos]);
    }

    public function uploadLogo(Request $request)
    {
        $validated = $request->validate([
            'type' => ['required', 'in:header_logo,footer_logo,favicon'],
            'file' => ['required', 'file', 'max:5120'],
        ]);

        $file = $request->file('file');
        $type = $validated['type'];
        $extension = strtolower($file->getClientOriginalExtension());

        $allowed = ['svg', 'png', 'jpg', 'jpeg', 'ico', 'webp'];
        if (!in_array($extension, $allowed)) {
            return response()->json(['message' => 'Invalid file type. Allowed: ' . implode(', ', $allowed)], 422);
        }

        $filename = $type . '.' . $extension;
        $path = $file->storeAs('logos', $filename, 'public');

        $typeKey = $type . '_type';
        Setting::setValue($type, 'storage/logos/' . $filename, 'cms');
        Setting::setValue($typeKey, $extension, 'cms');

        $url = '/storage/logos/' . $filename;

        return response()->json([
            'message' => 'Logo uploaded successfully',
            'url' => $url,
            'type' => $type,
            'extension' => $extension,
        ]);
    }

    public function updateSiteName(Request $request)
    {
        $validated = $request->validate([
            'site_name' => ['required', 'string', 'max:100'],
            'site_tagline' => ['nullable', 'string', 'max:200'],
        ]);

        Setting::setValue('site_name', $validated['site_name'], 'cms');
        if (isset($validated['site_tagline'])) {
            Setting::setValue('site_tagline', $validated['site_tagline'], 'cms');
        }

        return response()->json(['message' => 'Site name updated']);
    }

    public function removeLogo(Request $request)
    {
        $validated = $request->validate([
            'type' => ['required', 'in:header_logo,footer_logo,favicon'],
        ]);

        $type = $validated['type'];
        $currentValue = Setting::getValue($type, '');

        if ($currentValue && str_starts_with($currentValue, 'storage/logos/')) {
            $storagePath = str_replace('storage/logos/', 'public/logos/', $currentValue);
            if (Storage::exists($storagePath)) {
                Storage::delete($storagePath);
            }
        }

        Setting::setValue($type, '', 'cms');
        Setting::setValue($type . '_type', '', 'cms');

        return response()->json(['message' => 'Logo removed']);
    }

    public function getAllSettings()
    {
        $keys = [
            'site_name', 'site_tagline', 'site_description', 'hero_title', 'hero_subtitle',
            'cta_text', 'cta_url', 'announcement', 'announcement_enabled',
            'meta_title', 'meta_description', 'meta_keywords', 'ga_id', 'fb_pixel_id',
            'facebook_url', 'twitter_url', 'instagram_url', 'youtube_url',
            'telegram_url', 'discord_url', 'linkedin_url',
            'maintenance_mode', 'maintenance_message', 'allowed_ips',
            'theme_primary', 'theme_accent', 'theme_success',
        ];

        $settings = [];
        foreach ($keys as $key) {
            $settings[$key] = Setting::getValue($key, '');
        }

        $settings['announcement_enabled'] = Setting::getValue('announcement_enabled', '0') === '1';
        $settings['maintenance_mode'] = Setting::getValue('maintenance_mode', '0') === '1';
        $settings['theme_primary'] = Setting::getValue('theme_primary', '#2D4F97');
        $settings['theme_accent'] = Setting::getValue('theme_accent', '#1E8A8D');
        $settings['theme_success'] = Setting::getValue('theme_success', '#18C97A');

        return response()->json(['settings' => $settings]);
    }

    public function saveSettings(Request $request)
    {
        $validated = $request->validate([
            'section' => ['required', 'string', 'in:general,homepage,seo,social,maintenance'],
        ]);

        $section = $validated['section'];
        $data = $request->except(['section']);

        $booleanKeys = ['announcement_enabled', 'maintenance_mode'];

        foreach ($data as $key => $value) {
            if (in_array($key, $booleanKeys)) {
                $value = $value ? '1' : '0';
            }
            if (is_null($value)) {
                $value = '';
            }
            Setting::setValue($key, $value, 'cms');
        }

        return response()->json(['message' => ucfirst($section) . ' settings saved successfully']);
    }
}
